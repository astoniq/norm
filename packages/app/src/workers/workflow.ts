import {Worker} from "bullmq";
import {
    AddressingType,
    JobTopic,
    SubscriberJob,
    SubscribersDefine,
    SubscriberSource,
    Topic,
    TriggerEvent, TriggerEventBroadcast,
    TriggerEventMulticast,
    TriggerRecipient,
    TriggerRecipientsType,
    TriggerRecipientSubscriber,
    TriggerRecipientTopic,
    WorkflowJob
} from "@astoniq/norm-schema";
import {logger} from "../utils/logger.js";
import {WorkerOptions} from "./types.js";
import {JobParams} from "../queues/types.js";
import {generateStandardId} from "../utils/id.js";
import {chunk} from "../utils/array.js";

export const createWorkflowWorker = (options: WorkerOptions) => {

    const {
        redis,
        queues: {subscriber},
        queries: {topics, subscribers, topicSubscribers}
    } = options

    const queueChunkSize = 100;
    const subscriberTopicBatchSize = 100;
    const subscriberBatchSize = 500;

    const isTopic = (recipient: TriggerRecipient): recipient is TriggerRecipientTopic =>
        recipient.type === TriggerRecipientsType.Topic;


    const getTopicsByNames = async (names: Set<string>) => {
        return topics.findTopicsByNames(Array.from(names))
    }

    const splitByRecipientType = (mappedRecipients: TriggerRecipient[]): {
        singleSubscribers: Map<string, SubscribersDefine>,
        topicsNames: Set<string>
    } => {
        return mappedRecipients.reduce(
            (acc, mappedRecipient) => {
                if (!mappedRecipient) {
                    return acc;
                }

                if (isTopic(mappedRecipient)) {
                    acc.topicsNames.add(mappedRecipient.recipient)
                } else {

                    const subscriberDefine = buildSubscriberDefine(mappedRecipient)

                    acc.singleSubscribers.set(
                        subscriberDefine.subscriberId,
                        subscriberDefine
                    )
                }
                return acc
            },
            {
                singleSubscribers: new Map<string, SubscribersDefine>(),
                topicsNames: new Set<string>()
            }
        )
    }

    const buildSubscriberDefine = (
        subscriber: TriggerRecipientSubscriber): SubscribersDefine => {

        if (typeof subscriber.recipient === 'string') {
            return {subscriberId: subscriber.recipient}
        } else {
            return validateSubscriberDefine(subscriber.recipient)
        }
    }

    const validateSubscriberDefine = (recipient: SubscribersDefine) => {
        if (!recipient) {
            throw new Error('subscriberId under property to is not configured')
        }

        if (Array.isArray(recipient)) {
            throw new Error('subscriberId under property to is type array')
        }

        if (!recipient.subscriberId) {
            throw new Error(
                'subscriberId under property to is not configured'
            )
        }
        return recipient
    }

    const subscriberProcessQueueAddBulk = (
        jobs: JobParams<SubscriberJob>[]
    ) => {
        return Promise.all(
            chunk(jobs, queueChunkSize).map(chunk =>
                subscriber.addBulk(chunk)
            )
        )
    }

    const sendToProcessSubscriber = async (
        event: TriggerEvent,
        subscribers: SubscribersDefine[],
        subscriberSource: SubscriberSource) => {

        if (subscribers.length === 0) {
            return;
        }

        const jobs = mapSubscribersToSubscriberJobs(
            subscriberSource,
            subscribers,
            event
        )

        return subscriberProcessQueueAddBulk(jobs)
    }

    const mapSubscribersToSubscriberJobs = (
        subscriberSource: SubscriberSource,
        subscribers: SubscribersDefine[],
        event: TriggerEvent
    ): JobParams<SubscriberJob>[] => {
        return subscribers.map((subscriber) => {
            return {
                name: generateStandardId(),
                data: {
                    ...event,
                    subscriber: subscriber,
                    subscriberSource: subscriberSource,
                }
            }
        })
    }

    const validateTopicsExist = (
        topics: readonly Topic[],
        names: Set<string>
    ) => {
        if (topics.length === names.size) {
            return;
        }

        const storageTopicsNames = topics.map(topic => topic.name);
        const notFoundTopics = [...names].filter(
            name => !storageTopicsNames.includes(name)
        )

        if (notFoundTopics.length > 0) {
            throw new Error(`Topic with key ${notFoundTopics.join(',')} not found`)
        }
    }

    const triggerMulticastEvent = async (event: TriggerEventMulticast) => {

        const {
            to: recipients,
        } = event;

        const mappedRecipients = Array.isArray(recipients)
            ? recipients
            : [recipients];

        const {
            singleSubscribers,
            topicsNames
        } = splitByRecipientType(mappedRecipients)

        const subscribersToProcess = Array.from(singleSubscribers.values())

        if (subscribersToProcess.length > 0) {
            await sendToProcessSubscriber(
                event,
                subscribersToProcess,
                SubscriberSource.Single
            )
        }

        const availableTopics = await getTopicsByNames(topicsNames);

        validateTopicsExist(availableTopics, topicsNames);

        const singleSubscriberIds = Array.from(singleSubscribers.keys());
        const topicsIds = availableTopics.map(topic => topic.id);

        let subscribersList: SubscribersDefine[] = [];

        const topicSubscribersGenerator = await topicSubscribers
            .findTopicSubscribersByIds(topicsIds, singleSubscriberIds)


        for (const topicSubscriber of topicSubscribersGenerator) {

            subscribersList.push({subscriberId: topicSubscriber.externalId});

            if (subscribersList.length === subscriberTopicBatchSize) {
                await sendToProcessSubscriber(event, subscribersList, SubscriberSource.Topic)
                subscribersList = []
            }
        }

        if (subscribersList.length > 0) {
            await sendToProcessSubscriber(event, subscribersList, SubscriberSource.Topic)
        }
    }

    const triggerBroadcastEvent = async (event: TriggerEventBroadcast) => {

        let subscribersList: SubscribersDefine[] = [];
        const availableSubscribers = await subscribers.findAllSubscribers()

        for (const subscriber of availableSubscribers) {

            subscribersList.push({subscriberId: subscriber.externalId});

            if (subscribersList.length === subscriberBatchSize) {
                await sendToProcessSubscriber(event, subscribersList, SubscriberSource.Broadcast)
                subscribersList = []
            }
        }

        if (subscribersList.length > 0) {
            await sendToProcessSubscriber(event, subscribersList, SubscriberSource.Broadcast)
        }
    }

    return new Worker<WorkflowJob>(JobTopic.Workflow, async (job) => {

        const {data} = job

        try {
            switch (data.type) {
                case AddressingType.Multicast: {
                    return triggerMulticastEvent(data)
                }
                case AddressingType.Broadcast: {
                    return triggerBroadcastEvent(data)
                }
                default: {
                    return triggerMulticastEvent(data)
                }
            }
        } catch (error) {
            logger.error(error, 'Unexpected error has occurred when triggering event');
            throw error;
        }

    }, {
        connection: redis
    })
}
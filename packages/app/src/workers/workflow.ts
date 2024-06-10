import {Worker} from "bullmq";
import {
    JobTopic,
    SubscriberJob,
    SubscriberSource,
    Topic,
    WorkflowJob
} from "@astoniq/norm-schema";
import {logger} from "../utils/logger.js";
import {WorkerOptions} from "./types.js";
import {JobParams} from "../queues/types.js";
import {generateStandardId} from "../utils/id.js";
import {chunk} from "../utils/array.js";
import {
    TriggerAddressingType,
    SubscriberDefine,
    TriggerEvent,
    TriggerEventBroadcast,
    TriggerEventMulticast,
    TriggerRecipient,
    TriggerRecipientsType,
    TriggerRecipientSubscriber,
    TriggerRecipientTopic
} from "@astoniq/norm-shared";

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


    const getTopicsByTopicIds = async (topicIds: Set<string>) => {
        return topics.findTopicsByTopicIds(Array.from(topicIds))
    }

    const splitByRecipientType = (mappedRecipients: TriggerRecipient[]): {
        singleSubscribers: Map<string, SubscriberDefine>,
        singleTopics: Set<string>
    } => {
        return mappedRecipients.reduce(
            (acc, mappedRecipient) => {
                if (!mappedRecipient) {
                    return acc;
                }

                if (isTopic(mappedRecipient)) {
                    acc.singleTopics.add(mappedRecipient.recipient)
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
                singleSubscribers: new Map<string, SubscriberDefine>(),
                singleTopics: new Set<string>()
            }
        )
    }

    const buildSubscriberDefine = (
        subscriber: TriggerRecipientSubscriber): SubscriberDefine => {

        if (typeof subscriber.recipient === 'string') {
            return {subscriberId: subscriber.recipient}
        } else {
            return validateSubscriberDefine(subscriber.recipient)
        }
    }

    const validateSubscriberDefine = (recipient: SubscriberDefine) => {
        if (!recipient) {
            throw new Error('subscriberId under property to is not configured')
        }

        if (Array.isArray(recipient)) {
            throw new Error('subscriberId under property to is type array')
        }

        if (!recipient.subscriberId) {
            throw new Error('subscriberId under property to is not configured')
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
        tenantId: string,
        resourceId: string,
        event: TriggerEvent,
        subscribers: SubscriberDefine[],
        subscriberSource: SubscriberSource) => {

        if (subscribers.length === 0) {
            return;
        }

        const jobs = mapSubscribersToSubscriberJobs(
            tenantId,
            resourceId,
            subscriberSource,
            subscribers,
            event
        )

        return subscriberProcessQueueAddBulk(jobs)
    }

    const mapSubscribersToSubscriberJobs = (
        tenantId: string,
        resourceId: string,
        subscriberSource: SubscriberSource,
        subscribers: SubscriberDefine[],
        event: TriggerEvent
    ): JobParams<SubscriberJob>[] => {
        return subscribers.map((subscriber) => {
            return {
                name: generateStandardId(),
                data: {
                    event,
                    tenantId,
                    resourceId,
                    subscriber,
                    subscriberSource,
                }
            }
        })
    }

    const validateTopicsExist = (
        topics: readonly Topic[],
        ids: Set<string>
    ) => {
        if (topics.length === ids.size) {
            return;
        }

        const storageTopicsIds = topics.map(topic => topic.topicId);
        const notFoundTopics = [...ids].filter(
            id => !storageTopicsIds.includes(id)
        )

        if (notFoundTopics.length > 0) {
            throw new Error(`Topic with key ${notFoundTopics.join(',')} not found`)
        }
    }

    const triggerMulticastEvent = async (
        tenantId: string, resourceId: string, event: TriggerEventMulticast) => {

        const {
            to: recipients,
        } = event;

        const mappedRecipients = Array.isArray(recipients)
            ? recipients
            : [recipients];

        const {
            singleSubscribers,
            singleTopics
        } = splitByRecipientType(mappedRecipients)

        const subscribersToProcess = Array.from(singleSubscribers.values())

        if (subscribersToProcess.length > 0) {
            await sendToProcessSubscriber(
                tenantId,
                resourceId,
                event,
                subscribersToProcess,
                SubscriberSource.Single
            )
        }

        const availableTopics = await getTopicsByTopicIds(singleTopics);

        validateTopicsExist(availableTopics, singleTopics);

        const singleSubscriberIds = Array.from(singleSubscribers.keys());

        const topicsIds = availableTopics
            .map(topic => topic.id);

        let subscribersList: SubscriberDefine[] = [];

        const excludeSubscribers = await subscribers
            .findSubscriberBySubscriberIds(singleSubscriberIds)

        const excludeSubscriberIds = excludeSubscribers
            .map(subscriber => subscriber.id);

        const topicSubscribersGenerator = await topicSubscribers
            .findTopicSubscribersByTopicIds(topicsIds, excludeSubscriberIds)

        for (const topicSubscriber of topicSubscribersGenerator) {

            subscribersList.push(topicSubscriber);

            if (subscribersList.length === subscriberTopicBatchSize) {
                await sendToProcessSubscriber(
                    tenantId, resourceId, event, subscribersList, SubscriberSource.Topic)

                subscribersList = []
            }
        }

        if (subscribersList.length > 0) {
            await sendToProcessSubscriber(
                tenantId, resourceId, event, subscribersList, SubscriberSource.Topic)
        }
    }

    const triggerBroadcastEvent = async (
        tenantId: string, resourceId: string, event: TriggerEventBroadcast) => {

        let subscribersList: SubscriberDefine[] = [];
        const availableSubscribers = await subscribers.findAllSubscribers()

        for (const subscriber of availableSubscribers) {

            subscribersList.push(subscriber);

            if (subscribersList.length === subscriberBatchSize) {
                await sendToProcessSubscriber(
                    tenantId, resourceId, event, subscribersList, SubscriberSource.Broadcast)

                subscribersList = []
            }
        }

        if (subscribersList.length > 0) {
            await sendToProcessSubscriber(
                tenantId, resourceId, event, subscribersList, SubscriberSource.Broadcast)
        }
    }

    return new Worker<WorkflowJob>(JobTopic.Workflow, async (job) => {

        const {
            data: {event, tenantId, resourceId}
        } = job

        try {
            switch (event.type) {
                case TriggerAddressingType.Multicast: {
                    return triggerMulticastEvent(tenantId, resourceId, event)
                }
                case TriggerAddressingType.Broadcast: {
                    return triggerBroadcastEvent(tenantId, resourceId, event)
                }
                default: {
                    return triggerMulticastEvent(tenantId, resourceId, event)
                }
            }
        } catch (error) {
            logger.error(error, 'Unexpected error has occurred when triggering event');
        }

    }, {
        connection: redis
    })
}
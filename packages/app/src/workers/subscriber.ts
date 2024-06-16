import {Worker} from "bullmq";
import {
    JobTopic,
    Subscriber,
    SubscriberJob, NotificationStatus,
} from "@astoniq/norm-schema";
import {WorkerOptions} from "./types.js";
import {generateStandardId} from "../utils/id.js";
import {logger} from "../utils/logger.js";
import {SubscriberDefine} from "@astoniq/norm-shared";

export const createSubscriberWorker = (options: WorkerOptions) => {

    const {
        redis,
        queries: {subscribers, notifications, subscriberReferences},
        queues: {echo}
    } = options

    const createSubscriber = async (
        tenantId: string, subscriberDefine: SubscriberDefine): Promise<Subscriber> => {

        return subscribers.insertSubscriber({
            ...subscriberDefine,
            id: generateStandardId(),
            tenantId,
        })
    }

    const updateSubscriber = async (
        tenantId: string, subscriberDefine: SubscriberDefine): Promise<Subscriber> => {

        return subscribers.updateSubscriber({
            set: subscriberDefine,
            where: {subscriberId: subscriberDefine.subscriberId, tenantId},
            jsonbMode: "merge"
        })
    }

    const getSubscriber = async (
        tenantId: string, subscriberDefine: SubscriberDefine): Promise<Subscriber> => {

        const subscriber = await subscribers.hasSubscriberBySubscriberId(
            tenantId, subscriberDefine.subscriberId)

        if (subscriber) {
            return updateSubscriber(tenantId, subscriberDefine)
        }

        return createSubscriber(tenantId, subscriberDefine)
    }

    const updateSubscriberReferences = async (
        tenantId: string, subscriber: Subscriber, subscriberDefine: SubscriberDefine) => {

        const {references} = subscriberDefine;

        if (!references) {
            return
        }

        for (const reference of references) {

            await subscriberReferences.upsertSubscriberReference({
                id: generateStandardId(),
                tenantId,
                subscriberId: subscriber.id,
                target: reference.target,
                credentials: reference.credentials
            })
        }
    }

    const processSubscriber = async (
        tenantId: string, subscriberDefine: SubscriberDefine) => {

        const subscriber = await getSubscriber(tenantId, subscriberDefine)

        if (subscriber === null) {
            return undefined
        }

        await updateSubscriberReferences(tenantId, subscriber, subscriberDefine);

        return subscriber
    }

    return new Worker<SubscriberJob>(JobTopic.Subscriber, async (job) => {

        const {
            data: {
                event: {
                    payload,
                    notificationId,
                    actor = []
                },
                subscriber,
                resourceId,
                tenantId
            }
        } = job

        try {
            const subscriberProcessed = await processSubscriber(tenantId, subscriber)

            if (!subscriberProcessed) {
                logger.warn(subscriber, `Subscriber was not processed`);
                return;
            }

            const isSkipNotification = actor.find(
                actor => subscriber.subscriberId === actor);

            if (isSkipNotification) {
                logger.info(subscriber, `Subscriber is actor. Skipp notification`);
                return;
            }

            const insertNotificationId = generateStandardId()

            const notification = await notifications.insertNotification({
                id: insertNotificationId,
                tenantId,
                resourceId,
                payload,
                notificationId,
                subscriberId: subscriberProcessed.id,
                status: NotificationStatus.Pending
            })

            if (!notification) {
                logger.error('Notification could not be created');
                return;
            }

            await echo.add({
                name: generateStandardId(),
                data: {
                    tenantId: tenantId,
                    notificationId: insertNotificationId
                }
            })

        } catch (error) {
            logger.error(error)
        }

    }, {
        connection: redis
    })
}
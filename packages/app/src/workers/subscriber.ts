import {Worker} from "bullmq";
import {
    JobTopic,
    Subscriber,
    SubscriberJob, SubscriberDefine, NotificationStatus,
} from "@astoniq/norm-schema";
import {WorkerOptions} from "./types.js";
import {generateStandardId} from "../utils/id.js";
import {logger} from "../utils/logger.js";

export const createSubscriberWorker = (options: WorkerOptions) => {

    const {
        redis,
        queries: {subscribers, notifications},
        queues: {echo}
    } = options

    const createSubscriber = async (subscriberDefine: SubscriberDefine): Promise<Subscriber> => {
        return subscribers.insertSubscriber({
            id: generateStandardId(),
            ...subscriberDefine
        })
    }

    const updateSubscriber = async (subscriberDefine: SubscriberDefine): Promise<Subscriber> => {
        return subscribers.updateSubscriber({
            set: subscriberDefine,
            where: {subscriberId: subscriberDefine.subscriberId},
            jsonbMode: "merge"
        })
    }

    const getSubscriber = async (subscriberDefine: SubscriberDefine): Promise<Subscriber> => {

        const subscriber = await subscribers.hasSubscriberBySubscriberId(
            subscriberDefine.subscriberId)

        if (subscriber) {
            return updateSubscriber(subscriberDefine)
        }

        return createSubscriber(subscriberDefine)
    }

    const processSubscriber = async (subscriberDefine: SubscriberDefine) => {

        const subscriber = await getSubscriber(subscriberDefine)

        if (subscriber === null) {
            return undefined
        }

        return subscriber
    }

    return new Worker<SubscriberJob>(JobTopic.Subscriber, async (job) => {

        const {data} = job

        const subscriberProcessed = await processSubscriber(data.subscriber)

        if (!subscriberProcessed) {
            logger.warn(data.subscriber, `Subscriber was not processed`);
            return;
        }

        const notificationId = generateStandardId()

        // Создание записи notification
        const notification = await notifications.insertNotification({
            id: notificationId,
            subscriberId: subscriberProcessed.subscriberId,
            payload: data.payload,
            resourceId: data.resourceId,
            workflowId: data.workflowId,
            status: NotificationStatus.Pending
        })

        if (!notification) {
            logger.error('Notification could not be created');
            return;
        }

        // Отправка записи в echo worker
        await echo.add({
            name: generateStandardId(),
            data: {notificationId}
        })
    }, {
        connection: redis
    })
}
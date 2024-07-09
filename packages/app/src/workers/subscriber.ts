import {Worker} from "bullmq";
import {
    JobTopic,
    SubscriberJob, NotificationStatus,
} from "@astoniq/norm-schema";
import {WorkerOptions} from "./types.js";
import {generateStandardId} from "../utils/id.js";
import {logger} from "../utils/logger.js";
import {SubscriberDefine} from "@astoniq/norm-shared";

export const createSubscriberWorker = (options: WorkerOptions) => {

    const {
        redis,
        libraries: {
            subscribers: {
                getSubscriber,
                updateSubscriberReferences
            }
        },
        queries: {
            notifications: {
                insertNotification
            }
        },
        queues: {echo}
    } = options

    const processSubscriber = async (
        projectId: string, subscriberDefine: SubscriberDefine) => {

        const subscriber = await getSubscriber(projectId, subscriberDefine)

        if (subscriber === null) {
            return undefined
        }

        await updateSubscriberReferences(projectId, subscriber, subscriberDefine);

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
                projectId
            }
        } = job

        try {
            const subscriberProcessed = await processSubscriber(projectId, subscriber)

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

            const notification = await insertNotification({
                id: insertNotificationId,
                projectId,
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
                    projectId: projectId,
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
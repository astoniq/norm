import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {EchoJob, JobTopic, NotificationStatus} from "@astoniq/norm-schema";

export const createEchoWorker = (options: WorkerOptions) => {

    const {
        redis,
        queries: {
            notifications: {
                findNotificationById,
                updateNotificationStatusById
            }
        }
    } = options

    // const sendRequest = async (
    //     resource: Resource,
    //     payload: JsonObject) => {
    //     const {url} = resource;
    //
    //     return ky(url, {
    //         json: payload
    //     })
    // }

    return new Worker<EchoJob>(JobTopic.Echo, async (job) => {

            const {
                data: {
                    notificationId
                }
            } = job

            const notification = await findNotificationById(notificationId)

            if (!notification) {
                throw new Error(`Notification with ${notificationId} was not found`);
            }

            try {
                await updateNotificationStatusById(notificationId, NotificationStatus.Running)

            } catch {
                await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
            }
        },
        {
            connection: redis
        })
}
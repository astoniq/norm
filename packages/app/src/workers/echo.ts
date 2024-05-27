import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {
    EchoJob,
    JobTopic,
    Notification,
    NotificationStatus,
    Resource,
    ResourceConfig,
    Subscriber
} from "@astoniq/norm-schema";
import ky from "ky";
import {conditional, trySafe} from "@astoniq/essentials";
import {sign} from "../utils/sign.js";
import {ExecuteOutput, ExecutionEvent, ExecutionState} from "../types/index.js";
import {logger} from "../utils/logger.js";

type SendExecutionEventOptions = {
    resource: Resource,
    state: ExecutionState[]
    notification: Notification,
    subscriber: Subscriber
}

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

    const sendExecutionEventRequest = async (
        config: ResourceConfig,
        event: ExecutionEvent,
        signingKey: string
    ) => {
        const {url, headers} = config;

        return ky(url, {
            headers: {
                ...headers,
                ...conditional(signingKey && {
                    'x-norm-signature': sign(signingKey, event)
                })
            },
            json: event,
            retry: 3,
            timeout: 10_000
        })
    }

    const sendExecutionEvent = async (
        {
            resource, state, notification, subscriber
        }: SendExecutionEventOptions): Promise<ExecuteOutput> => {

        const {config, signingKey} = resource

        const {payload, workflowId} = notification

        try {
            const response = await sendExecutionEventRequest(config, {
                    payload,
                    workflowId,
                    state,
                    action: 'execute',
                    subscriber
                },
                signingKey);

            return response.json()

        } catch (error) {
            logger.error('Invalid fetch')
            throw error
        }
    }

    return new Worker<EchoJob>(JobTopic.Echo, async (job) => {

            const {
                data: {
                    notificationId
                }
            } = job

            try {

                const notification = await findNotificationById(notificationId)

                if (!notification) {
                    await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
                    return;
                }

                await updateNotificationStatusById(notificationId, NotificationStatus.Running)

                const {
                    id,
                    subscriberId,
                    resourceId
                } = notification

                const [steps, subscriber, resource] = await Promise.all([
                    trySafe(findAllStepByNotificationId(id)),
                    trySafe(findSubscriberBySubscriberId(subscriberId)),
                    trySafe(findResourceByResourceId(resourceId))
                ])


                const executeOutput = await sendExecutionEvent({
                    subscriber,
                    notification,
                    state,
                    resource
                })

            } catch {
                await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
            }
        },
        {
            connection: redis
        })
}
import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {
    EchoJob,
    JobTopic,
    Notification,
    NotificationStatus,
    Resource,
    ResourceConfig, Step,
    Subscriber
} from "@astoniq/norm-schema";
import ky from "ky";
import {conditional, trySafe} from "@astoniq/essentials";
import {sign} from "../utils/sign.js";
import {ExecuteOutput, ExecutionEvent, ExecutionState} from "../types/index.js";
import {logger} from "../utils/logger.js";
import {HTTPError} from "ky";

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
            },
            steps: {
                findAllStepByNotificationId
            },
            subscribers: {
                findSubscriberBySubscriberId
            },
            resources: {
                findResourceByResourceId
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
            searchParams: {
                action: 'execute'
            },
            method: 'POST',
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
            if (error instanceof HTTPError) {
                const {response} = error;
                const contentType = response.headers.get('content-type');
                if (contentType?.indexOf('application/json') !== -1) {
                    const json = await response.json();
                    logger.error(json)
                } else {
                    const message = await response.text();
                    logger.error(message)
                }
            }

            throw error
        }
    }

    const stepsToExecutionState = (steps?: readonly Step[]): ExecutionState[] => {
        if (!steps) {
            return []
        }
        return steps.map(step => ({
            stepId: step.stepId,
            type: step.type,
            result: step.result
        }))
    }

    return new Worker<EchoJob>(JobTopic.Echo, async (job) => {

            const {
                data: {
                    notificationId
                }
            } = job

            try {
              await updateNotificationStatusById(notificationId, NotificationStatus.Running)

                const notification = await findNotificationById(notificationId)

                if (!notification) {
                    await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
                    return;
                }

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

                if (!subscriber) {
                    await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
                    return;
                }

                if (!resource) {
                    await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
                    return;
                }

                const state = stepsToExecutionState(steps)

                const executeOutput = await sendExecutionEvent({
                    subscriber,
                    notification,
                    state,
                    resource
                })

                logger.info(executeOutput)

                await updateNotificationStatusById(notificationId, NotificationStatus.Completed)
            } catch (error) {
                logger.info(error)
                await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
            }
        },
        {
            connection: redis
        })
}
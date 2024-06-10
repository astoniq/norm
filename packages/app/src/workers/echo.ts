import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {
    EchoJob,
    JobTopic,
    Notification,
    NotificationStatus,
    Resource,
    ResourceConfig, Step, StepStatus,
    Subscriber
} from "@astoniq/norm-schema";
import ky from "ky";
import {conditional, trySafe} from "@astoniq/essentials";
import {sign} from "../utils/sign.js";
import {logger} from "../utils/logger.js";
import {HTTPError} from "ky";
import {generateStandardId} from "../utils/id.js";
import {ExecuteOutput, ExecutionEvent, ExecutionState} from "@astoniq/norm-shared";

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
                updateNotificationStatusById
            },
            steps: {
                findAllStepByNotificationId,
                insertStep
            },
            subscribers: {
                findSubscriberById
            },
            resources: {
                findResourceById
            }
        },
        queues: {message}
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

        const {payload, notificationId} = notification

        try {
            const response = await sendExecutionEventRequest(config, {
                    payload,
                    notificationId,
                    state,
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
                    notificationId,
                    tenantId
                }
            } = job

            try {
                const notification = await updateNotificationStatusById(
                    notificationId, NotificationStatus.Running)

                if (!notification) {
                    logger.error('Notification not found');
                    return;
                }

                const {
                    id,
                    subscriberId,
                    resourceId
                } = notification

                const [steps, subscriber, resource] = await Promise.all([
                    trySafe(findAllStepByNotificationId(id)),
                    trySafe(findSubscriberById(subscriberId)),
                    trySafe(findResourceById(resourceId))
                ])

                if (!subscriber) {
                    logger.info(`Subscriber ${subscriberId} not found`);
                    await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
                    return;
                }

                if (!resource) {
                    logger.info(`Resource ${resourceId} not found`);
                    await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
                    return;
                }

                const state = stepsToExecutionState(steps)

                const executionOutput = await sendExecutionEvent({
                    subscriber,
                    notification,
                    state,
                    resource
                })

                if (executionOutput.status) {
                    await updateNotificationStatusById(notificationId, NotificationStatus.Completed)
                } else {

                    const insertStepId = generateStandardId()

                    const step = await insertStep({
                        tenantId,
                        notificationId,
                        stepId: executionOutput.stepId,
                        type: executionOutput.type,
                        output: executionOutput.output,
                        id: insertStepId,
                        status: StepStatus.Pending
                    })

                    if (!step) {
                        logger.error('Step could not be created');
                        await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
                        return;
                    }

                    await message.add({
                        name: generateStandardId(),
                        data: {stepId: insertStepId, tenantId}
                    })
                }

            } catch (error) {
                logger.info(error)
                await updateNotificationStatusById(notificationId, NotificationStatus.Failed)
            }
        },
        {
            connection: redis
        })
}
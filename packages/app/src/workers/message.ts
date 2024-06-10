import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {
    JobTopic,
    MessageJob,
    Notification,
    Step,
    StepStatus,
    Subscriber,
} from "@astoniq/norm-schema";
import {logger} from "../utils/logger.js";
import {connectors} from "@astoniq/norm-connectors";
import {generateStandardId} from "../utils/id.js";

type SendMessageOptions = {
    tenantId: string;
    step: Step,
    notification: Notification,
    subscriber: Subscriber
}

export const createMessageWorker = (options: WorkerOptions) => {

    const {
        redis,
        queues: {echo},
        queries: {
            steps: {
                updateStepStatusById,
                findStepById,
                updateStepResultById
            },
            notifications: {
                findNotificationById
            },
            subscribers: {
                findSubscriberById,
            },
            subscriberReferences: {
                findSubscriberReferencesBySubscriberId
            },
            connectors: {
                findConnectorsByType
            }
        },
    } = options

    const sendMessageConnectors = async (options: SendMessageOptions) => {

        const {
            step,
            notification,
            tenantId,
            subscriber
        } = options

        try {

            const databaseConnectors = await findConnectorsByType(step.type);

            const subscriberReferences = await findSubscriberReferencesBySubscriberId(subscriber.id)

            let successSendMessage = false
            let resultSendMessage = {}

            for (const databaseConnector of databaseConnectors) {

                if (successSendMessage) {
                    return;
                }

                const {config, connectorId} = databaseConnector

                const connectorFactory = connectors
                    .find((connector) => connector.id === connectorId)

                if (!connectorFactory) {
                    logger.error('Connector factory not found')
                    break;
                }

                const {id, createConnector, target, optionsGuard, credentialsGuard} = connectorFactory

                try {

                    const sendMessage = await createConnector({
                        config
                    })

                    const {data, success} = optionsGuard.safeParse(step.output);

                    if (!success) {
                        logger.error('Invalid output')
                        break;
                    }

                    const subscriberReference = subscriberReferences
                        .find(reference => {
                            return reference.target === target
                        })

                    if (!subscriberReference) {
                        logger.error('Invalid subscriber reference')
                        break;
                    }

                    const credentials = credentialsGuard.safeParse(subscriberReference.credentials);

                    if (!credentials.success) {
                        logger.error('Invalid credentials')
                        break;
                    }

                    resultSendMessage = await sendMessage(credentials.data as any, data as any)

                    successSendMessage = true

                } catch (error) {
                    logger.error(error, `Error send connector ${id}. Skip connector`)
                }
            }

            if (successSendMessage) {
                await updateStepResultById(step.id, StepStatus.Completed, resultSendMessage)

                await echo.add({
                    name: generateStandardId(),
                    data: {notificationId: notification.id, tenantId}
                })
            } else {
                logger.info(`Error send message`)
                await updateStepStatusById(step.id, StepStatus.Failed)
            }
        } catch (error) {
            logger.error(error)
        }
    }

    const sendMessageByStep = async (tenantId: string, step: Step) => {

        try {
            await updateStepStatusById(step.id, StepStatus.Running)

            const notification = await findNotificationById(step.notificationId)

            if (!notification) {
                logger.error('Notification not found');
                return;
            }

            const subscriber = await findSubscriberById(notification.subscriberId)

            if (!subscriber) {
                logger.error('Subscriber not found');
                return;
            }

            return sendMessageConnectors({
                tenantId,
                step,
                notification,
                subscriber,
            })

        } catch (error) {
            await updateStepStatusById(step.id, StepStatus.Failed)
        }
    }

    return new Worker<MessageJob>(JobTopic.Message, async (job) => {

            const {
                data: {
                    stepId,
                    tenantId
                }
            } = job

            try {
                const step = await findStepById(stepId)

                if (!step) {
                    logger.error(`Step ${stepId} not found. Skip step`);
                    return;
                }

                return sendMessageByStep(tenantId, step)

            } catch (error) {
                logger.error(error, 'Sending message hash thrown an error')
            }
        },
        {
            connection: redis
        })
}
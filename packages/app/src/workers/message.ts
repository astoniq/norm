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
import {connectorFactories} from "@astoniq/norm-connectors";
import {generateStandardId} from "../utils/id.js";

type SendMessageOptions = {
    projectId: string;
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
                updateProjectStepStatusById,
                findProjectStepById,
                updateProjectStepResultById
            },
            notifications: {
                findProjectNotificationById
            },
            subscribers: {
                findProjectSubscriberById,
            },
            subscriberReferences: {
                findProjectSubscriberReferencesBySubscriberId
            },
            connectors: {
                findProjectConnectorsEnabled
            }
        },
    } = options

    const sendMessageConnectors = async (options: SendMessageOptions) => {

        const {
            step,
            notification,
            projectId,
            subscriber
        } = options

        try {

            const databaseConnectors = await findProjectConnectorsEnabled(projectId);

            const subscriberReferences = await findProjectSubscriberReferencesBySubscriberId(
                projectId, subscriber.id)

            let successSendMessage = false
            let resultSendMessage = {}

            for (const databaseConnector of databaseConnectors) {

                if (successSendMessage) {
                    return;
                }

                const {config, name} = databaseConnector

                const connectorFactory = connectorFactories
                    .find((connector) => connector.name === name
                        && connector.type === step.type)

                if (!connectorFactory) {
                    logger.error('Connector factory not found')
                    break;
                }

                const {createConnector, target, optionsGuard, credentialsGuard} = connectorFactory

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
                    logger.error(error, `Error send connector ${name}. Skip connector`)
                }
            }

            if (successSendMessage) {
                await updateProjectStepResultById(
                    projectId, step.id, StepStatus.Completed, resultSendMessage)

                await echo.add({
                    name: generateStandardId(),
                    data: {notificationId: notification.id, projectId}
                })
            } else {
                logger.info(`Error send message`)
                await updateProjectStepStatusById(projectId, step.id, StepStatus.Failed)
            }
        } catch (error) {
            logger.error(error)
        }
    }

    const sendMessageByStep = async (projectId: string, step: Step) => {

        try {
            await updateProjectStepStatusById(projectId, step.id, StepStatus.Running)

            const notification = await findProjectNotificationById(projectId, step.notificationId)

            if (!notification) {
                logger.error('Notification not found');
                return;
            }

            const subscriber = await findProjectSubscriberById(projectId, notification.subscriberId)

            if (!subscriber) {
                logger.error('Subscriber not found');
                return;
            }

            return sendMessageConnectors({
                projectId,
                step,
                notification,
                subscriber,
            })

        } catch (error) {
            await updateProjectStepStatusById(projectId, step.id, StepStatus.Failed)
        }
    }

    return new Worker<MessageJob>(JobTopic.Message, async (job) => {

            const {
                data: {
                    stepId,
                    projectId
                }
            } = job

            try {
                const step = await findProjectStepById(projectId, stepId)

                if (!step) {
                    logger.error(`Step ${stepId} not found. Skip step`);
                    return;
                }

                return sendMessageByStep(projectId, step)

            } catch (error) {
                logger.error(error, 'Sending message hash thrown an error')
            }
        },
        {
            connection: redis
        })
}
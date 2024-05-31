import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {ConnectorType, JobTopic, MessageJob, Notification, Step, StepStatus, Subscriber} from "@astoniq/norm-schema";
import {logger} from "../utils/logger.js";
import {connectors, EmailConnector, SmsConnector} from "@astoniq/norm-connectors";
import {z} from "zod";
import {generateStandardId} from "../utils/id.js";

type SendMessageOptions = {
    step: Step,
    notification: Notification,
    subscriber: Subscriber
}

type MappedConnectorType = {
    [ConnectorType.Email]: EmailConnector
    [ConnectorType.Sms]: SmsConnector
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
                findSubscriberBySubscriberId
            },
            connectors: {
                findConnectorsByType
            }
        },
    } = options

    const emailOutputSchema = z.object({
        subject: z.string(),
        body: z.string()
    })

    const sendMessageEmail = async (options: SendMessageOptions) => {

        const {
            step,
            notification,
            subscriber: {email}
        } = options

        try {

            if (!email) {
                logger.info('The subscriber does not have email. Skip send message email')
                await updateStepStatusById(step.id, StepStatus.Failed)
                return;
            }

            const {data, success} = emailOutputSchema.safeParse(step.output);

            if (!success) {
                logger.error('Invalid email output')
                await updateStepStatusById(step.id, StepStatus.Failed)
                return
            }

            const databaseConnectors = await findConnectorsByType(
                ConnectorType.Email);

            let successSendMessage = false

            for (const databaseConnector of databaseConnectors) {

                if (successSendMessage) {
                    return;
                }

                const {config, connectorId} = databaseConnector

                const connectorFactory = connectors[ConnectorType.Email]
                    .find((connector): connector is MappedConnectorType[ConnectorType.Email] =>
                        connector.metadata.id === connectorId)

                if (!connectorFactory) {
                    logger.error('Connector factory not found')
                    break;
                }

                const {metadata, createConnector} = connectorFactory

                try {
                    const sendMessage = await createConnector({
                        config
                    })

                    await sendMessage({
                        to: email,
                        subject: data.subject,
                        html: data.body
                    });

                    successSendMessage = true

                } catch (error) {
                    logger.error(error, `Error send connector ${metadata.id}. Skip connector`)
                }
            }

            if (successSendMessage) {
                await updateStepResultById(step.id, StepStatus.Completed, {})

                await echo.add({
                    name: generateStandardId(),
                    data: {notificationId: notification.id}
                })
            } else {
                logger.info(`Error send email message`)
                await updateStepStatusById(step.id, StepStatus.Failed)
            }
        } catch (error) {
            logger.error(error)
        }
    }

    const sendMessageByStep = async (step: Step) => {

        try {
            await updateStepStatusById(step.id, StepStatus.Running)

            const notification = await findNotificationById(step.notificationId)

            if (!notification) {
                logger.error('Notification not found');
                return;
            }

            const subscriber = await findSubscriberBySubscriberId(notification.subscriberId)

            if (!subscriber) {
                logger.error('Subscriber not found');
                return;
            }

            switch (step.type) {
                case ConnectorType.Email:
                    await sendMessageEmail({
                        step,
                        notification,
                        subscriber,
                    })
                    break;
                default:
                    logger.error('Step type not found')
            }

        } catch (error) {
            await updateStepStatusById(step.id, StepStatus.Failed)
        }
    }

    return new Worker<MessageJob>(JobTopic.Message, async (job) => {

            const {
                data: {
                    stepId
                }
            } = job

            try {
                const step = await findStepById(stepId)

                if (!step) {
                    logger.error(`Step ${stepId} not found. Skip step`);
                    return;
                }

                return sendMessageByStep(step)

            } catch (error) {
                logger.error(error, 'Sending message hash thrown an error')
            }
        },
        {
            connection: redis
        })
}
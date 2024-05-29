import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {ConnectorType, JobTopic, MessageJob, Notification, Step, StepStatus, Subscriber} from "@astoniq/norm-schema";
import {logger} from "../utils/logger.js";
import {connectors, EmailConnector, SmsConnector} from "@astoniq/norm-connectors";
import {z} from "zod";

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
        queries: {
            steps: {
                updateStepStatusById,
                updateStepResultById
            },
            notifications: {
                findNotificationById
            },
            subscribers: {
                findSubscriberBySubscriberId
            },
            connectors: {
                findConnectorByType
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
            subscriber
        } = options

        try {

            const databaseConnector = await findConnectorByType(
                ConnectorType.Email);

            if (!databaseConnector) {
                logger.error('Database connector not found')
                return
            }

            const {config, connectorId} = databaseConnector

            const connectorFactory = connectors[ConnectorType.Email]
                .find((connector): connector is MappedConnectorType[ConnectorType.Email] =>
                    connector.metadata.id === connectorId)

            if (!connectorFactory) {
                logger.error('Connector factory not found')
                return
            }

            const sendMessage = await connectorFactory.createConnector({
                config
            })

            const {data, success} = emailOutputSchema.safeParse(step.output);

            if (!success) {
                logger.error('Invalid output')
                return
            }

            const result = await sendMessage({
                to: subscriber.email,
                subject: data.subject,
                html: data.body
            });

            await updateStepResultById(step.id, StepStatus.Completed, result)

        } catch (error) {
            logger.error(error)
        }
    }


    return new Worker<MessageJob>(JobTopic.Message, async (job) => {

            const {
                data: {
                    stepId
                }
            } = job

            let shouldQueueNextJob = true

            try {
                const step = await updateStepStatusById(stepId, StepStatus.Running)

                if (!step) {
                    logger.error('Step not found');
                    return;
                }

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
                        return await sendMessageEmail({
                            step,
                            notification,
                            subscriber,
                        })
                    default:
                        logger.error('Step type not found')
                }

            } catch (error) {
                logger.error(error, 'Sending message hash thrown an error')
                shouldQueueNextJob = false;
            } finally {
                if (shouldQueueNextJob) {

                }
            }

        },
        {
            connection: redis
        })
}
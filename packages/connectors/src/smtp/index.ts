import {
    BaseConnector,
    ConnectorError,
    ConnectorErrorCodes,
    GetConnectorOptions,
    SendFunction,
} from "../types/index.js";
import {defaultMetadata} from "./metadata.js";
import {validateConfig} from "../utils/index.js";
import {EmailOptions, emailOptionsGuard, smtpConfigGuard} from "./types.js";
import {createTransport} from 'nodemailer';
import {ConnectorType, SubscriberEmailCredentials, SubscriberTarget} from "@astoniq/norm-shared";
import {subscriberEmailCredentialsGuard} from "@astoniq/norm-schema";

const createConnector = async (options: GetConnectorOptions):
    Promise<SendFunction<SubscriberEmailCredentials, EmailOptions>> => {

    const {config} = options

    validateConfig(config, smtpConfigGuard);

    const transport = createTransport(config)

    return async (credentials, data) => {
        try {
            await transport.sendMail({
                from: config.fromEmail,
                replyTo: config.replyTo,
                to: credentials.email,
                html: data.body,
                subject: data.subject
            })
        } catch (error) {
            throw new ConnectorError(
                ConnectorErrorCodes.General,
                error instanceof Error ? error.message : ''
            )
        }
    }
}

export const smtpConnector: BaseConnector<SubscriberEmailCredentials, EmailOptions> = {
    name: 'smtp',
    description: 'smtp',
    type: ConnectorType.Email,
    target: SubscriberTarget.Email,
    metadata: defaultMetadata,
    configGuard: smtpConfigGuard,
    optionsGuard: emailOptionsGuard,
    credentialsGuard: subscriberEmailCredentialsGuard,
    createConnector: createConnector
}

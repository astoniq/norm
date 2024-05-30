import {
    ConnectorError,
    ConnectorErrorCodes,
    ConnectorType,
    CreateConnector,
    EmailConnector,
    GetConnectorOptions,
    SendEmailFunction
} from "../types/index.js";
import {defaultMetadata} from "./metadata.js";
import {validateConfig} from "../utils/index.js";
import {smtpConfigGuard} from "./types.js";
import {createTransport} from 'nodemailer';

const createConnector: CreateConnector<SendEmailFunction> = async (options: GetConnectorOptions): Promise<SendEmailFunction> => {

    const {config} = options

    validateConfig(config, smtpConfigGuard);

    const transport = createTransport(config)

    return async (data) => {
        try {
            return await transport.sendMail({
                from: config.fromEmail,
                replyTo: config.replyTo,
                to: data.to,
                html: data.html,
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

export const smtpConnector: EmailConnector = {
    metadata: defaultMetadata,
    type: ConnectorType.Email,
    configGuard: smtpConfigGuard,
    createConnector: createConnector
}

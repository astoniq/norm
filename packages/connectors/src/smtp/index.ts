import {
    ConnectorError,
    ConnectorErrorCodes,
    ConnectorType,
    CreateConnector,
    EmailConnector,
    GetConnectorConfig,
    SendEmailFunction
} from "../types/index.js";
import {defaultMetadata} from "./metadata.js";
import {validateConfig} from "../utils/index.js";
import {smtpConfigGuard} from "./types.js";
import {createTransport} from 'nodemailer';

const sendMessage = async (getConfig: GetConnectorConfig): Promise<SendEmailFunction> => {

    const config = await getConfig(defaultMetadata.name);

    validateConfig(config, smtpConfigGuard);

    const transport = createTransport(config)

    return async (data) => {
        try {
            return await transport.sendMail({
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

export const smtpConnector: CreateConnector<EmailConnector> = async ({getConfig}) => {
    return {
        metadata: defaultMetadata,
        type: ConnectorType.Email,
        configGuard: smtpConfigGuard,
        sendMessage: sendMessage(getConfig)
    }
}
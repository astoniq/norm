import {ConnectorType, EmailConnector, SmsConnector} from "./types/index.js";
import {smtpConnector} from "./smtp/index.js";

export * from './types/index.js'
export * from './utils/index.js'

export type MappedConnectorType = {
    [ConnectorType.Email]: EmailConnector[]
    [ConnectorType.Sms]: SmsConnector[]
}

export const connectors: MappedConnectorType = {
    [ConnectorType.Email]: [
        smtpConnector
    ],
    [ConnectorType.Sms]: []
}

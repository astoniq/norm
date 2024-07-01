import {smtpConnector} from "./smtp/index.js";
import {smsConnector} from "./sms/index.js";
import {GetFactoryType} from "./types/index.js";

export const connectorFactories = [
    smtpConnector,
    smsConnector
]

export type ConnectorFactory = GetFactoryType<typeof connectorFactories>
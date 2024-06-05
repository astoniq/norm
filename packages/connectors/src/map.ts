import {smtpConnector} from "./smtp/index.js";
import {smsConnector} from "./sms/index.js";

export const connectors = [
    smtpConnector,
    smsConnector
]

import {BaseConnector, GetConnectorOptions, SendFunction,} from "../types/index.js";
import {defaultMetadata} from "./metadata.js";
import {ConnectorType, SubscriberSmsCredentials, SubscriberTarget} from "@astoniq/norm-shared";
import {smsConfigGuard, SmsOptions, smsOptionsGuard} from "./types.js";
import {subscriberSmsCredentialsGuard} from "@astoniq/norm-schema";
import * as console from "console";

const createConnector = async (_options: GetConnectorOptions):
    Promise<SendFunction<SubscriberSmsCredentials, SmsOptions>> => {


    return async (credentials, data) => {
        console.log(credentials, data)

    }
}

export const smsConnector: BaseConnector<SubscriberSmsCredentials, SmsOptions> = {
    id: 'sms',
    type: ConnectorType.Sms,
    target: SubscriberTarget.Sms,
    metadata: defaultMetadata,
    configGuard: smsConfigGuard,
    optionsGuard: smsOptionsGuard,
    credentialsGuard: subscriberSmsCredentialsGuard,
    createConnector: createConnector
}

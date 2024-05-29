import {EmailConnector, SmsConnector} from "./passwordless.js";

export type AllConnector = SmsConnector | EmailConnector

export type GetConnectorOptions = {
    config: any
}

export type CreateConnector<T> = (options: GetConnectorOptions) => Promise<T>
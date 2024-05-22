import {EmailConnector, SmsConnector} from "./passwordless.js";

export type AllConnector = SmsConnector | EmailConnector

export type GetConnectorConfig = (id: string) => Promise<unknown>;

export type CreateConnector<T extends AllConnector> = (options: {
    getConfig: GetConnectorConfig
}) => Promise<T>
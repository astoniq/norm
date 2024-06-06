import type {ZodType} from 'zod';
import {ConnectorMetadata} from "./metadata.js";
import {ConnectorType, SubscriberTarget} from "@astoniq/norm-shared";

export type GetConnectorOptions = {
    config: any
}

export type SendFunction<C, D> = (credentials: C, data: D) => Promise<any>

export type CreateConnector<T> = (options: GetConnectorOptions) => Promise<T>

export type BaseConnector<C , D > = {
    type: ConnectorType;
    target: SubscriberTarget;
    id: string;
    metadata: ConnectorMetadata;
    configGuard: ZodType;
    optionsGuard: ZodType<D>;
    credentialsGuard: ZodType<C>;
    createConnector: CreateConnector<SendFunction<C, D>>
};
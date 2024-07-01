import type {ZodType} from 'zod';
import {ConnectorType, SubscriberTarget} from "@astoniq/norm-shared";
import {ConnectorMetadata} from "@astoniq/norm-schema";

export type GetConnectorOptions = {
    config: any
}

export type GetFactoryType<T extends any[]> = T extends (infer U)[] ? U : never;

export type SendFunction<C, D> = (credentials: C, data: D) => Promise<any>

export type CreateConnector<T> = (options: GetConnectorOptions) => Promise<T>

export type BaseConnector<C , D > = {
    type: ConnectorType;
    target: SubscriberTarget;
    name: string;
    metadata: ConnectorMetadata;
    configGuard: ZodType;
    optionsGuard: ZodType<D>;
    credentialsGuard: ZodType<C>;
    createConnector: CreateConnector<SendFunction<C, D>>
};
import type { ZodType } from 'zod';
import {ConnectorMetadata} from "./metadata.js";

export enum ConnectorType {
    Email = 'Email',
    Sms = 'Sms',
}

export type BaseConnector<Type extends ConnectorType> = {
    type: Type;
    metadata: ConnectorMetadata;
    configGuard: ZodType;
};
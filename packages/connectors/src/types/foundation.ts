import type { ZodType } from 'zod';
import {ConnectorMetadata} from "./metadata.js";

export enum ConnectorType {
    Email = 'email',
    Sms = 'sms',
}

export type BaseConnector<Type extends ConnectorType> = {
    type: Type;
    metadata: ConnectorMetadata;
    configGuard: ZodType;
};
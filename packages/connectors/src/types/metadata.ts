import { z } from 'zod';
import {connectorConfigFormItemGuard} from "./config-form.js";

export const connectorMetadataGuard = z
    .object({
        configTemplate: z.string().optional(),
        formItems: connectorConfigFormItemGuard.array().optional(),
    });

export type ConnectorMetadata = z.infer<typeof connectorMetadataGuard>;

export const configurableConnectorMetadataGuard = connectorMetadataGuard.partial();

export type ConfigurableConnectorMetadata = z.infer<typeof configurableConnectorMetadataGuard>;
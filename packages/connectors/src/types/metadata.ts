import { z } from 'zod';
import {connectorConfigFormItemGuard} from "./config-form.js";

export const connectorMetadataGuard = z
    .object({
        target: z.string(),
        id: z.string(),
        configTemplate: z.string().optional(), // Connector config template
        formItems: connectorConfigFormItemGuard.array().optional(),
    });

export type ConnectorMetadata = z.infer<typeof connectorMetadataGuard>;

export const configurableConnectorMetadataGuard = connectorMetadataGuard
    .pick({
        target: true,
        id: true,
    })
    .partial();

export type ConfigurableConnectorMetadata = z.infer<typeof configurableConnectorMetadataGuard>;
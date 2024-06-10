import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";
import {ConnectorType} from "@astoniq/norm-shared";

export const createConnectorGuard = z.object({
    tenantId: z.string().max(21),
    connectorId: z.string().min(1).max(128),
    type: z.nativeEnum(ConnectorType),
    config: jsonObjectGuard
});

export type CreateConnector = z.infer<typeof createConnectorGuard>;

export const connectorGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    connectorId: z.string().min(1).max(128),
    type: z.nativeEnum(ConnectorType),
    config: jsonObjectGuard
});

export type Connector = z.infer<typeof connectorGuard>;
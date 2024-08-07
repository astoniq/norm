import {connectorGuard} from "../db/index.js";
import {z} from "zod";
import {ConnectorType, SubscriberTarget} from "@astoniq/norm-shared";
import {connectorMetadataGuard, createPaginationResponseGuard} from "../types/index.js";

export const createConnectorGuard = connectorGuard.pick({
    connectorId: true,
    name: true
})

export type CreateConnector = z.infer<typeof createConnectorGuard>;

export const connectorResponseGuard = connectorGuard.pick(
    {
        connectorId: true,
        name: true,
        projectId: true,
        config: true,
        id: true,
        createdAt: true,
        enabled: true
    })
    .and(z.object({
        metadata: connectorMetadataGuard,
        type: z.nativeEnum(ConnectorType),
        target: z.nativeEnum(SubscriberTarget),
        description: z.string()
    }))

export type ConnectorResponse = z.infer<typeof connectorResponseGuard>;

export const patchConnectorGuard = connectorGuard.pick({
    connectorId: true,
    config: true,
    enabled: true
}).partial()

export type PatchConnector = z.infer<typeof patchConnectorGuard>

export const connectorPaginationResponseGuard = createPaginationResponseGuard(connectorResponseGuard)

export type ConnectorPaginationResponse = z.infer<typeof connectorPaginationResponseGuard>

export const connectorFactoryResponseGuard = z.object({
    type: z.nativeEnum(ConnectorType),
    target: z.nativeEnum(SubscriberTarget),
    name: z.string(),
    description: z.string(),
    metadata: connectorMetadataGuard
})

export type ConnectorFactoryResponse = z.infer<typeof connectorFactoryResponseGuard>;
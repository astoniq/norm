import {Entity} from "../types/index.js";
import {Connector, connectorGuard, InsertConnector, insertConnectorGuard} from "@astoniq/norm-schema";

export const connectorEntity: Entity<
    Connector,
    InsertConnector
> = {
    table: 'connectors',
    tableSingular: 'connector',
    fields: {
        projectId: 'project_id',
        id: 'id',
        config: 'config',
        type: 'type',
        connectorId: 'connector_id',
        createdAt: 'created_at',
    },
    guard: connectorGuard,
    insertGuard: insertConnectorGuard
}
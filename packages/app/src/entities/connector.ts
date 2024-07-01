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
        connectorId: 'connector_id',
        name: 'name',
        createdAt: 'created_at',
    },
    guard: connectorGuard,
    insertGuard: insertConnectorGuard
}
import {Entity} from "../types/index.js";
import {Connector} from "@astoniq/norm-schema";

export const connectorEntity: Entity<Connector> =
    Object.freeze({
        table: 'connectors',
        tableSingular: 'connector',
        fields: {
            tenantId: 'tenant_id',
            id: 'id',
            config: 'config',
            type: 'type',
            connectorId: 'connector_id'
        },
    })
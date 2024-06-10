import {Entity} from "../types/index.js";
import {Resource} from "@astoniq/norm-schema";

export const resourceEntity: Entity<Resource> =
    Object.freeze({
        table: 'resources',
        tableSingular: 'resource',
        fields: {
            tenantId: 'tenant_id',
            id: 'id',
            resourceId: 'resource_id',
            config: 'config',
            enabled: 'enabled',
            signingKey: 'signing_key'
        },
    })
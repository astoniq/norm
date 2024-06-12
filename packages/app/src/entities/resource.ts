import {Entity} from "../types/index.js";
import {InsertResource, insertResourceGuard, Resource, resourceGuard} from "@astoniq/norm-schema";

export const resourceEntity: Entity<
    Resource,
    InsertResource
> = {
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
    guard: resourceGuard,
    insertGuard: insertResourceGuard
}
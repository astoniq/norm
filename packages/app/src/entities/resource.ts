import {Entity} from "../types/index.js";
import {InsertResource, insertResourceGuard, Resource, resourceGuard} from "@astoniq/norm-schema";

export const resourceEntity: Entity<
    Resource,
    InsertResource
> = {
    table: 'resources',
    tableSingular: 'resource',
    fields: {
        projectId: 'project_id',
        id: 'id',
        resourceId: 'resource_id',
        config: 'config',
        enabled: 'enabled',
        signingKey: 'signing_key',
        createdAt: 'created_at',
    },
    guard: resourceGuard,
    insertGuard: insertResourceGuard
}
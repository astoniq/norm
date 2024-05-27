import {Entity} from "../types/index.js";
import {Resource} from "@astoniq/norm-schema";

export const resourceEntity: Entity<Resource> =
    Object.freeze({
        table: 'resources',
        tableSingular: 'resource',
        fields: {
            id: 'id',
            resourceId: 'resource_id',
            config: 'config',
            signingKey: 'signing_key'
        },
    })
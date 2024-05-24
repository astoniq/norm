import {Entity} from "../types/index.js";
import {Resource} from "@astoniq/norm-schema";

export const resourceEntity: Entity<Resource> =
    Object.freeze({
        table: 'resources',
        fields: {
            id: 'id',
            url: 'url'
        },
        tableSingular: 'resource',
        fieldKeys: [
            'id',
            'url'
        ] as const,
    })
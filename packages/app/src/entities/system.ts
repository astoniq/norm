import {Entity} from "../types/index.js";
import {System} from "@astoniq/norm-schema";

export const systemEntity: Entity<System> =
    Object.freeze({
        table: 'systems',
        tableSingular: 'system',
        fields: {
            key: 'key',
            value: 'value'
        },
    })
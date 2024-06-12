import {Entity} from "../types/index.js";
import {InsertSystem, insertSystemGuard, System, systemGuard} from "@astoniq/norm-schema";

export const systemEntity: Entity<
    System,
    InsertSystem
> = {
    table: 'systems',
    tableSingular: 'system',
    fields: {
        key: 'key',
        value: 'value'
    },
    guard: systemGuard,
    insertGuard: insertSystemGuard
}
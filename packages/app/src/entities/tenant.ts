import {Entity} from "../types/index.js";
import {Tenant} from "@astoniq/norm-schema";

export const tenantEntity: Entity<Tenant> =
    Object.freeze({
        table: 'tenants',
        tableSingular: 'tenant',
        fields: {
            tenantId: 'tenant_id',
            id: 'id',
            clientKey: 'client_key'
        },
    })
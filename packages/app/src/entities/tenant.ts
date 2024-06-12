import {Entity} from "../types/index.js";
import {InsertTenant, insertTenantGuard, Tenant, tenantGuard} from "@astoniq/norm-schema";

export const tenantEntity: Entity<
    Tenant,
    InsertTenant
> = {
    table: 'tenants',
    tableSingular: 'tenant',
    fields: {
        tenantId: 'tenant_id',
        id: 'id',
        clientKey: 'client_key'
    },
    guard: tenantGuard,
    insertGuard: insertTenantGuard
}
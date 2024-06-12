import {z} from "zod";

export const tenantGuard = z.object({
    id: z.string().min(1).max(21),
    tenantId: z.string().min(1).max(128),
    clientKey: z.string().min(1).max(64),
});

export type Tenant = z.infer<typeof tenantGuard>;

export const insertTenantGuard = tenantGuard;

export type InsertTenant = z.infer<typeof insertTenantGuard>
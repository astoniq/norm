import {z} from "zod";
import {resourceConfigGuard} from "../types/index.js";

export const createResourceGuard = z.object({
    id: z.string().min(1).max(21),
    resourceId: z.string().min(1).max(256),
    config: resourceConfigGuard,
    enabled: z.boolean().optional(),
    signingKey: z.string().min(1).max(64)
});

export type CreateResource = z.infer<typeof createResourceGuard>;

export const resourceGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    resourceId: z.string().max(128),
    signingKey: z.string().max(64),
    enabled: z.boolean(),
    config: resourceConfigGuard,
});

export type Resource = z.infer<typeof resourceGuard>;
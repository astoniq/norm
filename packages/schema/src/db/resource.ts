import {z} from "zod";
import {resourceConfigGuard} from "../types/index.js";

export const createResourceGuard = z.object({
    id: z.string().min(1).max(21),
    resourceId: z.string().min(1).max(256),
    config: resourceConfigGuard,
    signingKey: z.string().min(1).max(64).optional()
});

export type CreateResource = z.infer<typeof createResourceGuard>;

export const resourceGuard = z.object({
    id: z.string().min(1).max(21),
    resourceId: z.string().max(256),
    config: resourceConfigGuard,
    signingKey: z.string().max(64),
});

export type Resource = z.infer<typeof resourceGuard>;
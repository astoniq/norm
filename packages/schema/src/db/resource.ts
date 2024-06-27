import {z} from "zod";
import {resourceConfigGuard} from "../types/index.js";

export const resourceGuard = z.object({
    projectId: z.string().max(21),
    id: z.string().min(1).max(21),
    resourceId: z.string().min(1).max(128),
    signingKey: z.string().max(64),
    enabled: z.boolean(),
    config: resourceConfigGuard,
    createdAt: z.number(),
});

export type Resource = z.infer<typeof resourceGuard>;

export const insertResourceGuard = resourceGuard.partial({
    enabled: true
});

export type InsertResource = z.infer<typeof insertResourceGuard>;

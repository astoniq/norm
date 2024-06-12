import {resourceGuard} from "../db/index.js";
import {z} from "zod";

export const createResourceRequestGuard = resourceGuard.pick({
    resourceId: true,
    config: true
})

export type CreateResourceRequest = z.infer<typeof createResourceRequestGuard>;

import {resourceGuard} from "../db/index.js";
import {z} from "zod";

export const createResourceGuard = resourceGuard.pick({
    resourceId: true,
    config: true
})

export type CreateResource = z.infer<typeof createResourceGuard>;

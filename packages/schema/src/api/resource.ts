import {resourceGuard} from "../db/index.js";
import {z} from "zod";
import {createPaginationResponseGuard} from "./pagination.js";

export const createResourceGuard = resourceGuard.pick({
    resourceId: true,
    config: true
})

export type CreateResource = z.infer<typeof createResourceGuard>;

export const resourceResponseGuard = resourceGuard;

export type ResourceResponse = z.infer<typeof resourceResponseGuard>;

export const resourcePaginationResponseGuard = createPaginationResponseGuard(resourceResponseGuard)

export type ResourcePaginationResponse =  z.infer<typeof resourcePaginationResponseGuard>

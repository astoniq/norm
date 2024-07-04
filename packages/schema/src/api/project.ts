import {projectGuard} from "../db/index.js";
import {z} from "zod";
import {createPaginationResponseGuard} from "./pagination.js";

export const createProjectGuard = projectGuard.pick({
    projectId: true
})

export type CreateProject = z.infer<typeof createProjectGuard>;

export const projectResponseGuard = projectGuard;

export type ProjectResponse = z.infer<typeof projectResponseGuard>;

export const patchProjectGuard = projectGuard.pick({
    projectId: true
})

export type PatchProject = z.infer<typeof patchProjectGuard>

export const projectPaginationResponseGuard = createPaginationResponseGuard(projectResponseGuard)

export type ProjectPaginationResponse =  z.infer<typeof projectPaginationResponseGuard>
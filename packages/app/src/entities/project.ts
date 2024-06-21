import {Entity} from "../types/index.js";
import {InsertProject, insertProjectGuard, Project, projectGuard} from "@astoniq/norm-schema";

export const projectEntity: Entity<
    Project,
    InsertProject
> = {
    table: 'projects',
    tableSingular: 'project',
    fields: {
        projectId: 'project_id',
        id: 'id',
        clientKey: 'client_key'
    },
    guard: projectGuard,
    insertGuard: insertProjectGuard
}
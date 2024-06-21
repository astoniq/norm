import {z} from "zod";

export const projectGuard = z.object({
    id: z.string().min(1).max(21),
    projectId: z.string().min(1).max(128),
    clientKey: z.string().min(1).max(64),
});

export type Project = z.infer<typeof projectGuard>;

export const insertProjectGuard = projectGuard;

export type InsertProject = z.infer<typeof insertProjectGuard>
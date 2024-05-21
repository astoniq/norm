import {z} from "zod";

export const createResourceGuard = z.object({
    id: z.string().min(1).max(21),
});

export type CreateResource = z.infer<typeof createResourceGuard>;

export const resourceGuard = z.object({
    id: z.string().min(1).max(21),
});

export type Resource = z.infer<typeof resourceGuard>;
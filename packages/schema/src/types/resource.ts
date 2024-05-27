import {z} from "zod";

export const resourceConfigGuard = z.object({
    url: z.string(),
    headers: z.record(z.string()).optional()
})

export type ResourceConfig = z.infer<typeof resourceConfigGuard>
import {z} from "zod";

export const countGuard = z.object({
    count: z.number(),
})
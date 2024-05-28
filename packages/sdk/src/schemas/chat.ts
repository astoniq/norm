import {z} from "zod";

export const chatOutputSchema = z.object({
    body: z.string()
})

export const chatResultSchema = z.object({})
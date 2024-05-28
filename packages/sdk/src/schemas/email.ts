import {z} from "zod";

export const emailOutputSchema = z.object({
    subject: z.string(),
    body: z.string()
})

export const emailResultSchema = z.object({})
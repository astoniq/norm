import {z} from "zod";

export const pushOutputSchema = z.object({
    subject: z.string(),
    body: z.string()
})

export const pushResultSchema = z.object({})
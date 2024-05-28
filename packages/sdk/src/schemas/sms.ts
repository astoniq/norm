import {z} from "zod";

export const smsOutputSchema = z.object({
    body: z.string()
})

export const smsResultSchema = z.object({})
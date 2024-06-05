import {z} from "zod";

export const smsConfigGuard = z.object({
    host: z.string(),
    port: z.number(),
})

export type SmsConfig = z.infer<typeof smsConfigGuard>;

export const smsOptionsGuard = z.object({
    body: z.string()
})

export type SmsOptions = z.infer<typeof smsOptionsGuard>;
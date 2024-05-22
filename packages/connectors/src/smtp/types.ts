import {z} from "zod";

export const smtpConfigGuard = z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    password: z.string(),
    secure: z.boolean().default(false),
    tls: z
        .union([z.object({}).catchall(z.unknown()), z.object({})])
        .optional()
        .default({}),
    servername: z.string().optional(),
    ignoreTLS: z.boolean().optional(),
    requireTLS: z.boolean().optional(),
    connectionTimeout: z
        .number()
        .optional()
        .default(2 * 60 * 1000), // In ms, default is 2 mins.
    greetingTimeout: z
        .number()
        .optional()
        .default(30 * 1000), // In ms, default is 30 seconds.
    socketTimeout: z
        .number()
        .optional()
        .default(10 * 60 * 1000), // In ms, default is 10 mins.
    dnsTimeout: z
        .number()
        .optional()
        .default(30 * 1000), // In ms, default is 30 seconds.
    name: z.string().optional(),
    localAddress: z.string().optional(),
})

export type SmtpConfig = z.infer<typeof smtpConfigGuard>;

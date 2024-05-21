import {z} from "zod";
import {BaseConnector, ConnectorType} from "./foundation.js";

export const sendEmailOptionsGuard = z.object({
    to: z.string(),
    subject: z.string(),
    html: z.string()
})

export type SendEmailOptions = z.infer<typeof sendEmailOptionsGuard>

export type SendEmailFunction = (data: SendEmailOptions) => Promise<unknown>;

export type EmailConnector = BaseConnector<ConnectorType.Email> & {
    sendMessage: Promise<SendEmailFunction>
}

export const sendSmsOptionsGuard = z.object({
    to: z.string(),
    content: z.string()
})

export type SendSmsOptions = z.infer<typeof sendSmsOptionsGuard>

export type SendSmsFunction = (data: SendSmsOptions) => Promise<unknown>;

export type SmsConnector = BaseConnector<ConnectorType.Sms> & {
    sendMessage: Promise<SendSmsFunction>
}
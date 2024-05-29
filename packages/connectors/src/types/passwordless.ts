import {z} from "zod";
import {BaseConnector, ConnectorType} from "./foundation.js";
import {CreateConnector} from "./factory.js";

export const sendEmailOptionsGuard = z.object({
    to: z.string(),
    subject: z.string(),
    html: z.string()
})

export type SendEmailOptions = z.infer<typeof sendEmailOptionsGuard>

export type SendEmailFunction = (data: SendEmailOptions) => Promise<any>;

export type EmailConnector = BaseConnector<ConnectorType.Email> & {
    createConnector: CreateConnector<SendEmailFunction>
}

export const sendSmsOptionsGuard = z.object({
    to: z.string(),
    content: z.string()
})

export type SendSmsOptions = z.infer<typeof sendSmsOptionsGuard>

export type SendSmsFunction = (data: SendSmsOptions) => Promise<any>;

export type SmsConnector = BaseConnector<ConnectorType.Sms> & {
    createConnector: CreateConnector<SendSmsFunction>
}
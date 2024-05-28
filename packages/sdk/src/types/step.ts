import {MaybePromise} from "./base.js";
import {
    chatOutputSchema, chatResultSchema,
    emailOutputSchema,
    emailResultSchema,
    pushOutputSchema, pushResultSchema,
    smsOutputSchema,
    smsResultSchema
} from "../schemas/index.js";
import {ZodSchema, z} from "zod";

export type ActionStepOptions = {}

export type ActionStep<Output, Result> = (
    stepId: string,
    resolve: () => MaybePromise<Output>,
    options?: ActionStepOptions
) => Promise<Result>

export type ChannelStep<Output, Result> = (
    stepId: string,
    resolve: () => MaybePromise<Output>,
    options?: {}
) => Promise<Result>

export type AppStep = <Output, Result>(
    stepId: string,
    resolve: () => MaybePromise<Output>,
    options?: {
        outputSchema?: ZodSchema<Output>;
        resultSchema?: ZodSchema<Result>;
    }
) => Promise<Result>;

export type EmailOutput = z.infer<typeof emailOutputSchema>
export type EmailResult = z.infer<typeof emailResultSchema>

export type SmsOutput = z.infer<typeof smsOutputSchema>
export type SmsResult = z.infer<typeof smsResultSchema>

export type PushOutput = z.infer<typeof pushOutputSchema>
export type PushResult = z.infer<typeof pushResultSchema>

export type ChatOutput = z.infer<typeof chatOutputSchema>
export type ChatResult = z.infer<typeof chatResultSchema>


export type Step = {
    email: ChannelStep<EmailOutput, EmailResult>;
    sms: ChannelStep<SmsOutput, SmsResult>;
    push: ChannelStep<PushOutput, PushResult>;
    chat: ChannelStep<ChatOutput, ChatResult>;
    app: AppStep
}
import {MaybePromise} from "./base.js";
import {Schema} from "./schema.js";
import {FromSchema} from "json-schema-to-ts";
import {
    chatOutputSchema, chatResultSchema,
    emailOutputSchema,
    emailResultSchema,
    pushOutputSchema, pushResultSchema,
    smsOutputSchema,
    smsResultSchema
} from "../schemas/index.js";

export enum JobStatus {
    Pending = 'pending',
    Queued = 'queued',
    Running = 'running',
    Completed = 'completed',
    Failed = 'failed',
    Delayed = 'delayed',
    Canceled = 'canceled',
    Merged = 'merged',
    Skipped = 'skipper'
}

type StepContext = {
    timestamp: number,
    state: {
        status: `${JobStatus}`,
        error: boolean
    }
}

export type ActionStepOptions = {
    inputSchema?: Schema
}

type StepOutput<StepResult> = Promise<StepResult & { ctx: StepContext }>;

export type ActionStep<Inputs, Outputs, Result> = (
    stepId: string,
    resolve: (inputs: Inputs) => MaybePromise<Outputs>,
    options?: ActionStepOptions
) => StepOutput<Result>

export type ChannelStep<
    Outputs,
    Result> = <InputSchema extends Schema, Inputs = FromSchema<InputSchema>>(
    stepId: string,
    resolve: (inputs: Inputs) => MaybePromise<Outputs>,
    options?: {
        inputSchema?: InputSchema
    }
) => StepOutput<Result>

export type EmailOutput = FromSchema<typeof emailOutputSchema>
export type EmailResult = FromSchema<typeof emailResultSchema>

export type SmsOutput = FromSchema<typeof smsOutputSchema>
export type SmsResult = FromSchema<typeof smsResultSchema>

export type PushOutput = FromSchema<typeof pushOutputSchema>
export type PushResult = FromSchema<typeof pushResultSchema>

export type ChatOutput = FromSchema<typeof chatOutputSchema>
export type ChatResult = FromSchema<typeof chatResultSchema>


export type Step = {
    email: ChannelStep<EmailOutput, EmailResult>;
    sms: ChannelStep<SmsOutput, SmsResult>;
    push: ChannelStep<PushOutput, PushResult>;
    chat: ChannelStep<ChatOutput, ChatResult>;
}
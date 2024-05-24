import {z} from "zod";
import {triggerEventBaseGuard, triggerEventGuard} from "./event.js";
import {subscriberDefineGuard, SubscriberSource} from "./subscriber.js";

export enum JobTopic {
    Workflow = 'workflow',
    Subscriber = 'subscriber',
    Message = 'message',
    Echo = 'echo'
}

export const workflowJob = triggerEventGuard

export type WorkflowJob = z.infer<typeof workflowJob>

export const subscriberJob = z.object({
    ...triggerEventBaseGuard,
    subscriber: subscriberDefineGuard,
    subscriberSource: z.nativeEnum(SubscriberSource)
})

export type SubscriberJob = z.infer<typeof subscriberJob>

export const echoJob = z.object({
    notificationId: z.string().min(1).max(21)
})

export type EchoJob = z.infer<typeof echoJob>
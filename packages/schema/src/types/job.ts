import {z} from "zod";
import {triggerEventBaseGuard, triggerEventGuard} from "./event.js";
import {subscribersDefineGuard, SubscriberSource} from "./subscriber.js";

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
    subscriber: subscribersDefineGuard,
    subscriberSource: z.nativeEnum(SubscriberSource)
})

export type SubscriberJob = z.infer<typeof subscriberJob>
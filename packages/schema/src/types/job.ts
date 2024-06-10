import {z} from "zod";
import {triggerEventBaseGuard, triggerEventGuard} from "./event.js";
import {subscriberDefineGuard, SubscriberSource} from "./subscriber.js";

export enum JobTopic {
    Workflow = 'workflow',
    Subscriber = 'subscriber',
    Message = 'message',
    Echo = 'echo'
}

export const baseJobGuard = z.object({
    tenantId: z.string().min(1).max(21)
})

export type BaseJob = z.infer<typeof baseJobGuard>

export const workflowJobGuard = z.object({
    event: triggerEventGuard,
    resourceId: z.string().min(1).max(21)
}).and(baseJobGuard)

export type WorkflowJob = z.infer<typeof workflowJobGuard>

export const subscriberJobGuard = z.object({
    subscriber: subscriberDefineGuard,
    subscriberSource: z.nativeEnum(SubscriberSource),
    event: triggerEventBaseGuard,
    resourceId: z.string().min(1).max(21)
}).and(baseJobGuard)

export type SubscriberJob = z.infer<typeof subscriberJobGuard>

export const echoJobGuard = z.object({
    notificationId: z.string().min(1).max(21)
}).and(baseJobGuard)

export type EchoJob = z.infer<typeof echoJobGuard>

export const messageJobGuard = z.object({
    stepId: z.string().min(1).max(21)
}).and(baseJobGuard)

export type MessageJob = z.infer<typeof messageJobGuard>
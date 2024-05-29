import {z} from "zod";

export enum SubscriberSource {
    Broadcast = 'broadcast',
    Single = 'single',
    Topic = 'topic'
}

export const subscriberPayloadGuard = z.object({
    email: z.string().optional()
})

export type SubscriberPayload = z.infer<typeof subscriberPayloadGuard>;

export const subscriberDefineGuard = z.object({
    subscriberId: z.string()
}).merge(subscriberPayloadGuard)

export type SubscriberDefine = z.infer<typeof subscriberDefineGuard>

export const subscriberCredentialEmailGuard = z.object({
    email: z.string()
})

export const subscriberCredentialSmsGuard = z.object({
    phone: z.string()
})

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

export const subscribersDefineGuard = z.object({
    subscriberId: z.string()
}).merge(subscriberPayloadGuard)

export type SubscribersDefine = z.infer<typeof subscribersDefineGuard>
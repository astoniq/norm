import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export enum SubscriberSource {
    Broadcast = 'broadcast',
    Single = 'single',
    Topic = 'topic'
}

export const subscriberReferencePayloadGuard = z.object({
    target: z.string().min(1).max(128),
    credentials: jsonObjectGuard
})

export const subscriberPayloadGuard = z.object({
    username: z.string().max(128).nullable().optional(),
    email: z.string().max(128).nullable().optional(),
    phone: z.string().max(128).nullable().optional(),
    name: z.string().max(128).nullable().optional(),
    locale: z.string().max(128).nullable().optional(),
    avatar: z.string().max(2048).nullable().optional(),
    references: z.array(subscriberReferencePayloadGuard).optional()
})

export type SubscriberPayload = z.infer<typeof subscriberPayloadGuard>;

export const subscriberDefineGuard = z.object({
    subscriberId: z.string(),
}).merge(subscriberPayloadGuard)

export type SubscriberDefine = z.infer<typeof subscriberDefineGuard>

import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";
import {SubscriberDefine, SubscriberPayload, SubscriberReferencePayload} from "@astoniq/norm-shared";

export enum SubscriberSource {
    Broadcast = 'broadcast',
    Single = 'single',
    Topic = 'topic'
}

export const subscriberReferencePayloadGuard: z.ZodType<SubscriberReferencePayload> = z.object({
    target: z.string().min(1).max(128),
    credentials: jsonObjectGuard
})

export const subscriberPayloadGuard: z.ZodType<SubscriberPayload> = z.object({
    username: z.string().max(128).nullable().optional(),
    email: z.string().max(128).nullable().optional(),
    phone: z.string().max(128).nullable().optional(),
    name: z.string().max(128).nullable().optional(),
    locale: z.string().max(128).nullable().optional(),
    avatar: z.string().max(2048).nullable().optional(),
    references: z.array(subscriberReferencePayloadGuard).optional()
})

export const subscriberDefineGuard: z.ZodType<SubscriberDefine> = z.object({
    subscriberId: z.string(),
}).and(subscriberPayloadGuard)

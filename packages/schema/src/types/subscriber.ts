import {z, ZodType} from "zod";
import {
    SubscriberAppCredentials,
    SubscriberDefine,
    SubscriberEmailCredentials,
    SubscriberPayload,
    SubscriberReferenceAppPayload,
    SubscriberReferenceEmailPayload,
    SubscriberReferencePayload,
    SubscriberReferenceSmsPayload,
    SubscriberSmsCredentials,
    SubscriberTarget
} from "@astoniq/norm-shared";

export enum SubscriberSource {
    Broadcast = 'broadcast',
    Single = 'single',
    Topic = 'topic'
}

export const subscriberEmailCredentialsGuard: z.ZodType<SubscriberEmailCredentials> = z.object({
    email: z.string()
})

export const subscriberReferenceEmailPayloadGuard = z.object({
    target: z.literal(SubscriberTarget.Email),
    credentials: subscriberEmailCredentialsGuard
}) satisfies ZodType<SubscriberReferenceEmailPayload>

export const subscriberSmsCredentialsGuard: z.ZodType<SubscriberSmsCredentials> = z.object({
    phone: z.string()
})

export const subscriberReferenceSmsPayloadGuard = z.object({
    target: z.literal(SubscriberTarget.Sms),
    credentials: subscriberSmsCredentialsGuard
}) satisfies ZodType<SubscriberReferenceSmsPayload>

export const subscriberAppCredentialsGuard: z.ZodType<SubscriberAppCredentials> = z.object({
    token: z.string()
})

export const subscriberReferenceAppPayloadGuard = z.object({
    target: z.literal(SubscriberTarget.App),
    credentials: subscriberAppCredentialsGuard
}) satisfies ZodType<SubscriberReferenceAppPayload>

export const subscriberReferencePayloadGuard: z.ZodType<SubscriberReferencePayload> = z.discriminatedUnion(
    'target',
    [
        subscriberReferenceEmailPayloadGuard,
        subscriberReferenceSmsPayloadGuard,
        subscriberReferenceAppPayloadGuard
    ])

export const subscriberPayloadGuard: z.ZodType<SubscriberPayload> = z.object({
    username: z.string().max(128).nullable().optional(),
    email: z.string().max(128).nullable().optional(),
    phone: z.string().max(128).nullable().optional(),
    name: z.string().max(128).nullable().optional(),
    locale: z.string().max(128).nullable().optional(),
    avatar: z.string().max(2048).nullable().optional(),
})

export const subscriberDefineGuard: z.ZodType<SubscriberDefine> = z.object({
    subscriberId: z.string(),
    references: z.array(subscriberReferencePayloadGuard).optional()
}).and(subscriberPayloadGuard)

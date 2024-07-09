import {z, ZodType} from "zod";
import {
    SubscriberIdCredentials,
    SubscriberDefine,
    SubscriberEmailCredentials,
    SubscriberPayload,
    SubscriberReferenceIdPayload,
    SubscriberReferenceEmailPayload,
    SubscriberReferencePayload,
    SubscriberReferencePhonePayload,
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
    referenceId: z.string(),
    target: z.literal(SubscriberTarget.Email),
    credentials: subscriberEmailCredentialsGuard
}) satisfies ZodType<SubscriberReferenceEmailPayload>

export const subscriberSmsCredentialsGuard: z.ZodType<SubscriberSmsCredentials> = z.object({
    phone: z.string()
})

export const subscriberReferenceSmsPayloadGuard = z.object({
    referenceId: z.string(),
    target: z.literal(SubscriberTarget.Phone),
    credentials: subscriberSmsCredentialsGuard
}) satisfies ZodType<SubscriberReferencePhonePayload>

export const subscriberAppCredentialsGuard: z.ZodType<SubscriberIdCredentials> = z.object({
    id: z.string()
})

export const subscriberReferenceIdPayloadGuard = z.object({
    referenceId: z.string(),
    target: z.literal(SubscriberTarget.Id),
    credentials: subscriberAppCredentialsGuard
}) satisfies ZodType<SubscriberReferenceIdPayload>

export const subscriberReferencePayloadGuard: z.ZodType<SubscriberReferencePayload> = z.discriminatedUnion(
    'target',
    [
        subscriberReferenceEmailPayloadGuard,
        subscriberReferenceSmsPayloadGuard,
        subscriberReferenceIdPayloadGuard
    ])

export const subscriberPayloadGuard: z.ZodType<SubscriberPayload> = z.object({
    username: z.string().max(128).nullable().optional(),
    name: z.string().max(128).nullable().optional(),
    locale: z.string().max(128).nullable().optional(),
    avatar: z.string().max(2048).nullable().optional(),
})

export const subscriberDefineGuard: z.ZodType<SubscriberDefine> = z.object({
    subscriberId: z.string(),
    references: z.array(subscriberReferencePayloadGuard).optional()
}).and(subscriberPayloadGuard)

import {z, ZodType} from "zod";
import {subscriberPayloadGuard, subscriberReferencePayloadGuard} from "../types/index.js";
import {
    CreateClientSubscriber,
    CreateClientSubscriberReferences,
    RemoveClientSubscriber,
    RemoveClientSubscriberReferences
} from "@astoniq/norm-shared";

export const createClientSubscriberGuard: z.ZodType<CreateClientSubscriber> = z.object({
    subscriberId: z.string(),
    references: z.array(subscriberReferencePayloadGuard).optional()
}).and(subscriberPayloadGuard)

export const removeClientSubscriberGuard: ZodType<RemoveClientSubscriber> = z.object({
    subscriberId: z.string().min(1)
})

export const createClientSubscriberReferencesGuard: z.ZodType<CreateClientSubscriberReferences> = z.object({
    subscriberId: z.string(),
    references: subscriberReferencePayloadGuard.array().min(1).nonempty()
})

export const removeClientSubscriberReferencesGuard: z.ZodType<RemoveClientSubscriberReferences> = z.object({
    subscriberId: z.string(),
    referenceIds: z.string().min(1).array().nonempty()
})
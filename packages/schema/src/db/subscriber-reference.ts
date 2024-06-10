import {z} from "zod";
import {subscriberReferencePayloadGuard} from "../types/index.js";

export const createSubscriberReferenceGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
}).and(subscriberReferencePayloadGuard);

export type CreateSubscriberReference = z.infer<typeof createSubscriberReferenceGuard>;

export const subscriberReferenceGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
}).and(subscriberReferencePayloadGuard);

export type SubscriberReference = z.infer<typeof subscriberReferenceGuard>;
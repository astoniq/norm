import {z} from "zod";
import {subscriberReferencePayloadGuard} from "../types/index.js";

export const subscriberReferenceGuard = z.object({
    projectId: z.string().max(21),
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    createdAt: z.number(),
}).and(subscriberReferencePayloadGuard);

export type SubscriberReference = z.infer<typeof subscriberReferenceGuard>;

export const insertSubscriberReferenceGuard = subscriberReferenceGuard;

export type InsertSubscriberReference = z.infer<typeof insertSubscriberReferenceGuard>
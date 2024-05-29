import {z} from "zod";
import {ConnectorType} from "../types/index.js";
import {jsonObjectGuard} from "../foundations/index.js";

export const createSubscriberReferenceGuard = z.object({
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(128),
    active: z.boolean(),
    type: z.nativeEnum(ConnectorType),
    credentials: jsonObjectGuard
});

export type CreateSubscriberReference = z.infer<typeof createSubscriberReferenceGuard>;

export const subscriberReferenceGuard = z.object({
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(128),
    active: z.boolean(),
    type: z.nativeEnum(ConnectorType),
    credentials: jsonObjectGuard
});

export type SubscriberReference = z.infer<typeof subscriberReferenceGuard>;
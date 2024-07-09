import {z} from "zod";
import {subscriberPayloadGuard, subscriberReferencePayloadGuard} from "../types/index.js";
import {CreateClientSubscriber} from "@astoniq/norm-shared";

export const createClientSubscriberGuard: z.ZodType<CreateClientSubscriber> = z.object({
    subscriberId: z.string(),
    references: z.array(subscriberReferencePayloadGuard).optional()
}).and(subscriberPayloadGuard)
import {z, ZodType} from "zod";
import {CreateClientTopic, CreateClientTopicSubscribers} from "@astoniq/norm-shared";

export const createClientTopicGuard: ZodType<CreateClientTopic> = z.object({
    topicId: z.string().min(1),
    subscriberIds: z.string().array().optional()
})

export const createClientTopicSubscribersGuard: ZodType<CreateClientTopicSubscribers> = z.object({
    topicId: z.string().min(1),
    subscriberIds: z.string().min(1).array().nonempty()
})
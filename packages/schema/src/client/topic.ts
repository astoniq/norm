import {topicGuard} from "../db/index.js";
import {z, ZodType} from "zod";
import {CreateClientTopic, CreateClientTopicSubscribers} from "@astoniq/norm-shared";

export const createClientTopicGuard: ZodType<CreateClientTopic> = topicGuard.pick({
    topicId: true
})

export const createClientTopicSubscribersGuard: ZodType<CreateClientTopicSubscribers> = z.object({
    topicId: z.string().min(1),
    subscriberIds: z.string().min(1).array().nonempty()
})
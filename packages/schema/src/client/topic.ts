import {topicGuard} from "../db/index.js";
import {ZodType} from "zod";
import {ClientTopic, CreateClientTopic} from "@astoniq/norm-shared";

export const createClientTopicGuard: ZodType<CreateClientTopic> = topicGuard.pick({
    topicId: true
})

export const patchClientTopicGuard = topicGuard.pick({
    topicId: true
})

export const topicClientResponseGuard: ZodType<ClientTopic> = topicGuard;
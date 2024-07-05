import {topicGuard} from "../db/index.js";
import {z} from "zod";
import {createPaginationResponseGuard} from "../types/index.js";

export const createTopicGuard = topicGuard.pick({
    topicId: true
})

export type CreateTopic = z.infer<typeof createTopicGuard>;

export const patchTopicGuard = topicGuard.pick({
    topicId: true
})

export type PatchTopic = z.infer<typeof patchTopicGuard>

export const topicResponseGuard = topicGuard;

export type TopicResponse = z.infer<typeof topicResponseGuard>;

export const topicPaginationResponseGuard = createPaginationResponseGuard(topicResponseGuard)

export type TopicPaginationResponse = z.infer<typeof topicPaginationResponseGuard>

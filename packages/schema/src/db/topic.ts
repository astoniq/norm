import {z} from "zod";

export const createTopicGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    topicId: z.string().min(1).max(128),
});

export type CreateTopic = z.infer<typeof createTopicGuard>;

export const topicGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    topicId: z.string().min(1).max(128),
});

export type Topic = z.infer<typeof topicGuard>;
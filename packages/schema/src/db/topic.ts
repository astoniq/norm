import {z} from "zod";

export const topicGuard = z.object({
    projectId: z.string().max(21),
    id: z.string().min(1).max(21),
    topicId: z.string().min(1).max(128),
    createdAt: z.number(),
});

export type Topic = z.infer<typeof topicGuard>;

export const insertTopicGuard = topicGuard;

export type InsertTopic = z.infer<typeof insertTopicGuard>
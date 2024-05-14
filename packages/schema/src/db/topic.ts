import {z} from "zod";

export const createTopicGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(128),
    description: z.string().min(1).max(128),
});

export type CreateTopic = z.infer<typeof createTopicGuard>;

export const topicGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(128),
    description: z.string().min(1).max(128),
});

export type Topic = z.infer<typeof topicGuard>;
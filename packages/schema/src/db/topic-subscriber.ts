import {z} from "zod";

export const topicSubscriberGuard = z.object({
    projectId: z.string().max(21),
    id: z.string().min(1).max(21),
    topicId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    createdAt: z.number(),
});

export type TopicSubscriber = z.infer<typeof topicSubscriberGuard>;

export const insertTopicSubscriberGuard = topicSubscriberGuard.pick({
    id: true,
    projectId: true,
    subscriberId: true,
    topicId: true
});

export type InsertTopicSubscriber = z.infer<typeof insertTopicSubscriberGuard>
import {z} from "zod";

export const topicSubscriberGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    topicId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
});

export type TopicSubscriber = z.infer<typeof topicSubscriberGuard>;

export const insertTopicSubscriberGuard = topicSubscriberGuard;

export type InsertTopicSubscriber = z.infer<typeof insertTopicSubscriberGuard>
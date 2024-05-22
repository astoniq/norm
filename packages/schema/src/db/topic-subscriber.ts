import {z} from "zod";

export const createTopicSubscriberGuard = z.object({
    id: z.string().min(1).max(21),
    topicId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    externalId: z.string().min(1).max(128),
});

export type CreateTopicSubscriber = z.infer<typeof createTopicSubscriberGuard>;

export const topicSubscriberGuard = z.object({
    id: z.string().min(1).max(21),
    topicId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    externalId: z.string().min(1).max(128),
});

export type TopicSubscriber = z.infer<typeof topicSubscriberGuard>;
import {z} from "zod";

export const subscriberGuard = z.object({
    projectId: z.string().max(21),
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(128),
    username: z.string().min(1).max(128).nullable(),
    name: z.string().min(1).max(128).nullable(),
    locale: z.string().min(1).max(128).nullable(),
    avatar: z.string().min(1).max(2048).nullable(),
    createdAt: z.number(),
});

export type Subscriber = z.infer<typeof subscriberGuard>;

export const insertSubscriberGuard = subscriberGuard.partial({
    username: true,
    name: true,
    locale: true,
    avatar: true
})

export type InsertSubscriber = z.infer<typeof insertSubscriberGuard>
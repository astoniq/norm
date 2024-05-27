import {z} from "zod";

export const createSubscriberGuard = z.object({
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(128),
    email: z.string().max(128)
});

export type CreateSubscriber = z.infer<typeof createSubscriberGuard>;

export const subscriberGuard = z.object({
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(128),
    email: z.string().max(128)
});

export type Subscriber = z.infer<typeof subscriberGuard>;
import {z} from "zod";

export const createSubscriberGuard = z.object({
    id: z.string().min(1).max(21),
});

export type CreateSubscriber = z.infer<typeof createSubscriberGuard>;

export const subscriberGuard = z.object({
    id: z.string().min(1).max(21),
});

export type Subscriber = z.infer<typeof subscriberGuard>;
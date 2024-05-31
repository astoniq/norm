import {z} from "zod";

export const createSubscriberGuard = z.object({
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(128),
    username: z.string().max(128).nullable().optional(),
    email: z.string().max(128).nullable().optional(),
    phone: z.string().max(128).nullable().optional(),
    name: z.string().max(128).nullable().optional(),
    locale: z.string().max(128).nullable().optional(),
    avatar: z.string().max(2048).nullable().optional(),
});

export type CreateSubscriber = z.infer<typeof createSubscriberGuard>;

export const subscriberGuard = z.object({
    id: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(128),
    username: z.string().min(1).max(128).nullable(),
    email: z.string().min(1).max(128).nullable(),
    phone: z.string().min(1).max(128).nullable(),
    name: z.string().min(1).max(128).nullable(),
    locale: z.string().min(1).max(128).nullable(),
    avatar: z.string().min(1).max(2048).nullable(),
});

export type Subscriber = z.infer<typeof subscriberGuard>;
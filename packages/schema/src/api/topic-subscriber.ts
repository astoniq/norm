import {z} from "zod";

export const createTopicSubscribersGuard = z.object({
    subscriberIds: z.string().min(1).array().nonempty()
})

export type CreateTopicSubscribers = z.infer<typeof createTopicSubscribersGuard>;

import {z} from "zod";

export const createStepGuard = z.object({
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(21)
});

export type CreateStep = z.infer<typeof createStepGuard>;

export const stepGuard = z.object({
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(21)
});

export type Step = z.infer<typeof stepGuard>;
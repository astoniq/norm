import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export const createStepGuard = z.object({
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(21),
    stepId: z.string().min(1).max(21),
    type: z.string().min(1).max(255),
    status: z.string().min(1).max(128),
    result: jsonObjectGuard,
});

export type CreateStep = z.infer<typeof createStepGuard>;

export const stepGuard = z.object({
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(21),
    stepId: z.string().min(1).max(21),
    type: z.string().min(1).max(255),
    status: z.string().min(1).max(128),
    result: jsonObjectGuard,
});

export type Step = z.infer<typeof stepGuard>;
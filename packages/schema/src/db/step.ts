import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";
import {ConnectorType} from "@astoniq/norm-shared";

export const createStepGuard = z.object({
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(21),
    stepId: z.string().min(1).max(21),
    type: z.nativeEnum(ConnectorType),
    status: z.string().min(1).max(128),
    output: jsonObjectGuard.optional(),
    result: jsonObjectGuard.optional(),
});

export type CreateStep = z.infer<typeof createStepGuard>;

export const stepGuard = z.object({
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(21),
    stepId: z.string().min(1).max(21),
    type: z.nativeEnum(ConnectorType),
    status: z.string().min(1).max(128),
    output: jsonObjectGuard,
    result: jsonObjectGuard,
});

export type Step = z.infer<typeof stepGuard>;
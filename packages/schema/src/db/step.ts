import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";
import {ConnectorType} from "@astoniq/norm-shared";

export const stepGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(21),
    stepId: z.string().min(1).max(128),
    type: z.nativeEnum(ConnectorType),
    status: z.string().min(1).max(128),
    output: jsonObjectGuard,
    result: jsonObjectGuard,
});

export type Step = z.infer<typeof stepGuard>;

export const insertStepGuard = stepGuard.partial({
    output: true,
    result: true
})

export type InsertStep = z.infer<typeof insertStepGuard>;
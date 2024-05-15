import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export const createSystemGuard = z.object({
    key: z.string().min(1).max(256),
    value: jsonObjectGuard,
});

export type CreateSystem = z.infer<typeof createSystemGuard>;

export const systemGuard = z.object({
    key: z.string().min(1).max(256),
    value: jsonObjectGuard,
})

export type System = z.infer<typeof systemGuard>;
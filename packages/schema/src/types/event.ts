import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export enum TriggerEventStatus {
    Error = 'error',
    Processed = 'processed',
}

export const triggerEventRequestGuard = z.object({
    name: z.string().min(1),
    to: z.array(z.string()),
    payload: jsonObjectGuard
})

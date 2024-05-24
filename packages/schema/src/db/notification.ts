import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export const createNotificationGuard = z.object({
    id: z.string().min(1).max(21),
    resourceId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    payload: jsonObjectGuard
});

export type CreateNotification = z.infer<typeof createNotificationGuard>;

export const notificationGuard = z.object({
    id: z.string().min(1).max(21),
    resourceId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    payload: jsonObjectGuard
});

export type Notification = z.infer<typeof notificationGuard>;
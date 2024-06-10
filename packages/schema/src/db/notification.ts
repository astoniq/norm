import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export const createNotificationGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(128),
    resourceId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    status: z.string().min(1).max(128),
    payload: jsonObjectGuard
});

export type CreateNotification = z.infer<typeof createNotificationGuard>;

export const notificationGuard = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(128),
    resourceId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    status: z.string().min(1).max(128),
    payload: jsonObjectGuard
});

export type Notification = z.infer<typeof notificationGuard>;
import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export const notificationGuard = z.object({
    projectId: z.string().max(21),
    id: z.string().min(1).max(21),
    notificationId: z.string().min(1).max(128),
    resourceId: z.string().min(1).max(21),
    subscriberId: z.string().min(1).max(21),
    status: z.string().min(1).max(128),
    payload: jsonObjectGuard,
    createdAt: z.number(),
});

export type Notification = z.infer<typeof notificationGuard>;

export const insertNotificationGuard = notificationGuard;

export type InsertNotification = z.infer<typeof insertNotificationGuard>
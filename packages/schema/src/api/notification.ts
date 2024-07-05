import {notificationGuard} from "../db/index.js";
import {z} from "zod";
import {createPaginationResponseGuard} from "./pagination.js";

export const notificationResponseGuard = notificationGuard;

export type NotificationResponse = z.infer<typeof notificationResponseGuard>;

export const notificationPaginationResponseGuard = createPaginationResponseGuard(notificationResponseGuard)

export type NotificationPaginationResponse = z.infer<typeof notificationPaginationResponseGuard>

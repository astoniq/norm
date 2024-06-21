import {Entity} from "../types/index.js";
import {InsertNotification, insertNotificationGuard, Notification, notificationGuard} from "@astoniq/norm-schema";

export const notificationEntity: Entity<
    Notification,
    InsertNotification
> = {
    table: 'notifications',
    tableSingular: 'notification',
    fields: {
        projectId: 'project_id',
        id: 'id',
        notificationId: 'notification_id',
        resourceId: 'resource_id',
        subscriberId: 'subscriber_id',
        payload: 'payload',
        status: 'status'
    },
    guard: notificationGuard,
    insertGuard: insertNotificationGuard
}
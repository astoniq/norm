import {Entity} from "../types/index.js";
import {Notification} from "@astoniq/norm-schema";

export const notificationEntity: Entity<Notification> =
    Object.freeze({
        table: 'notifications',
        tableSingular: 'notification',
        fields: {
            tenantId: 'tenant_id',
            id: 'id',
            notificationId: 'notification_id',
            resourceId: 'resource_id',
            subscriberId: 'subscriber_id',
            payload: 'payload',
            status: 'status'
        },
    })
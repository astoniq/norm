import {Entity} from "../types/index.js";
import {Notification} from "@astoniq/norm-schema";

export const notificationEntity: Entity<Notification> =
    Object.freeze({
        table: 'notifications',
        fields: {
            id: 'id',
            resourceId: 'resource_id',
            subscriberId: 'subscriber_id',
            payload: 'payload'
        },
        tableSingular: 'notification',
        fieldKeys: [
            'id',
            'resourceId',
            'subscriberId',
            'payload'
        ] as const,
    })
import {Entity} from "../types/index.js";
import {Notification} from "@astoniq/norm-schema";

export const notificationEntity: Entity<Notification> =
    Object.freeze({
        table: 'notifications',
        tableSingular: 'notification',
        fields: {
            id: 'id',
            workflowId: 'workflow_id',
            resourceId: 'resource_id',
            subscriberId: 'subscriber_id',
            payload: 'payload',
            status: 'status'
        },
    })
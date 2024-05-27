import {Entity} from "../types/index.js";
import {Step} from "@astoniq/norm-schema";

export const stepEntity: Entity<Step> =
    Object.freeze({
        table: 'steps',
        tableSingular: 'step',
        fields: {
            id: 'id',
            status: 'status',
            stepId: 'step_id',
            notificationId: 'notification_id',
            type: 'type',
            result: 'result'
        },
    })
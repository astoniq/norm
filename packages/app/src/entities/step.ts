import {Entity} from "../types/index.js";
import {InsertStep, insertStepGuard, Step, stepGuard} from "@astoniq/norm-schema";

export const stepEntity: Entity<
    Step,
    InsertStep
> = {
    table: 'steps',
    tableSingular: 'step',
    fields: {
        tenantId: 'tenant_id',
        id: 'id',
        status: 'status',
        stepId: 'step_id',
        notificationId: 'notification_id',
        type: 'type',
        result: 'result',
        output: 'output'
    },
    guard: stepGuard,
    insertGuard: insertStepGuard
}
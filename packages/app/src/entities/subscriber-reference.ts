import {Entity} from "../types/index.js";
import {
    InsertSubscriberReference,
    insertSubscriberReferenceGuard,
    SubscriberReference,
    subscriberReferenceGuard
} from "@astoniq/norm-schema";

export const subscriberReferenceEntity: Entity<
    SubscriberReference,
    InsertSubscriberReference
> = {
    table: 'subscriber_references',
    tableSingular: 'subscriber_reference',
    fields: {
        projectId: 'project_id',
        id: 'id',
        subscriberId: 'subscriber_id',
        referenceId: 'reference_id',
        credentials: 'credentials',
        target: 'target',
        createdAt: 'created_at',
    },
    guard: subscriberReferenceGuard,
    insertGuard: insertSubscriberReferenceGuard
}
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
        tenantId: 'tenant_id',
        id: 'id',
        subscriberId: 'subscriber_id',
        credentials: 'credentials',
        target: 'target'
    },
    guard: subscriberReferenceGuard,
    insertGuard: insertSubscriberReferenceGuard
}
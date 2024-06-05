import {Entity} from "../types/index.js";
import {SubscriberReference} from "@astoniq/norm-schema";

export const subscriberReferenceEntity: Entity<SubscriberReference> =
    Object.freeze({
        table: 'subscriber_references',
        tableSingular: 'subscriber_reference',
        fields: {
            id: 'id',
            subscriberId: 'subscriber_id',
            credentials: 'credentials',
            target: 'target'
        },
    })
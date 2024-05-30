import {Entity} from "../types/index.js";
import {SubscriberReference} from "@astoniq/norm-schema";

export const subscriberReferenceEntity: Entity<SubscriberReference> =
    Object.freeze({
        table: 'subscriber-references',
        tableSingular: 'subscriber-reference',
        fields: {
            id: 'id',
            subscriberId: 'subscriber_id',
            credentials: 'credentials',
            target: 'target'
        },
    })
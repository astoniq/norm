import {Entity} from "../types/index.js";
import {Subscriber} from "@astoniq/norm-schema";

export const subscriberEntity: Entity<Subscriber> =
    Object.freeze({
        table: 'subscribers',
        fields: {
            id: 'id',
            externalId: 'external_id',
            email: 'email'
        },
        tableSingular: 'system',
        fieldKeys: [
            'id',
            'externalId',
            'email'
        ] as const,
    })
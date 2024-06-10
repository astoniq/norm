import {Entity} from "../types/index.js";
import {Subscriber} from "@astoniq/norm-schema";

export const subscriberEntity: Entity<Subscriber> =
    Object.freeze({
        table: 'subscribers',
        tableSingular: 'system',
        fields: {
            tenantId: 'tenant_id',
            id: 'id',
            subscriberId: 'subscriber_id',
            name: 'name',
            avatar: 'avatar',
            phone: 'phone',
            email: 'email',
            username: 'username',
            locale: 'locale'
        },
    })
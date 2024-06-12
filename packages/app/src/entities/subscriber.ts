import {Entity} from "../types/index.js";
import {InsertSubscriber, insertSubscriberGuard, Subscriber, subscriberGuard} from "@astoniq/norm-schema";

export const subscriberEntity: Entity<
    Subscriber,
    InsertSubscriber
> = {
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
    guard: subscriberGuard,
    insertGuard: insertSubscriberGuard
}
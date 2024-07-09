import {Entity} from "../types/index.js";
import {InsertSubscriber, insertSubscriberGuard, Subscriber, subscriberGuard} from "@astoniq/norm-schema";

export const subscriberEntity: Entity<
    Subscriber,
    InsertSubscriber
> = {
    table: 'subscribers',
    tableSingular: 'system',
    fields: {
        projectId: 'project_id',
        id: 'id',
        subscriberId: 'subscriber_id',
        name: 'name',
        avatar: 'avatar',
        username: 'username',
        locale: 'locale',
        createdAt: 'created_at',
    },
    guard: subscriberGuard,
    insertGuard: insertSubscriberGuard
}
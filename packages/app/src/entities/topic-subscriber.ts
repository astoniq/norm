import {
    InsertTopicSubscriber,
    insertTopicSubscriberGuard,
    TopicSubscriber,
    topicSubscriberGuard
} from "@astoniq/norm-schema";
import {Entity} from "../types/index.js";

export const topicSubscriberEntity: Entity<
    TopicSubscriber,
    InsertTopicSubscriber
> = {
    table: 'topic_subscribers',
    tableSingular: 'topic_subscriber',
    fields: {
        tenantId: 'tenant_id',
        id: 'id',
        topicId: 'topic_id',
        subscriberId: 'subscriber_id'
    },
    guard: topicSubscriberGuard,
    insertGuard: insertTopicSubscriberGuard
};
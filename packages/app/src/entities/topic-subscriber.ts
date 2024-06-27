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
        projectId: 'project_id',
        id: 'id',
        topicId: 'topic_id',
        subscriberId: 'subscriber_id',
        createdAt: 'created_at',
    },
    guard: topicSubscriberGuard,
    insertGuard: insertTopicSubscriberGuard
};
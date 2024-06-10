import {TopicSubscriber} from "@astoniq/norm-schema";
import {Entity} from "../types/index.js";

export const topicSubscriberEntity: Entity<TopicSubscriber> =
    Object.freeze({
        table: 'topic_subscribers',
        tableSingular: 'topic_subscriber',
        fields: {
            tenantId: 'tenant_id',
            id: 'id',
            topicId: 'topic_id',
            subscriberId: 'subscriber_id'
        },
    });
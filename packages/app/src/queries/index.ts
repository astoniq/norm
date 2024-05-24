import {CommonQueryMethods} from "slonik";
import {createNotificationQueries} from "./notification.js";
import {createTopicQueries} from "./topic.js";
import {createTopicSubscriberQueries} from "./topic-subscriber.js";
import {createSubscriberQueries} from "./subscriber.js";
import {createResourceQueries} from "./resource.js";

export type Queries = ReturnType<typeof createQueries>

export const createQueries = (pool: CommonQueryMethods) => {

    const notifications = createNotificationQueries(pool)
    const topics = createTopicQueries(pool)
    const topicSubscribers = createTopicSubscriberQueries(pool)
    const subscribers = createSubscriberQueries(pool)
    const resources = createResourceQueries(pool)

    return {
        subscribers,
        notifications,
        topics,
        resources,
        topicSubscribers
    }
}
import {CommonQueryMethods} from "slonik";
import {createNotificationQueries} from "./notification.js";
import {createTopicQueries} from "./topic.js";
import {createTopicSubscriberQueries} from "./topic-subscriber.js";
import {createSubscriberQueries} from "./subscriber.js";

export type Queries = ReturnType<typeof createQueries>

export const createQueries = (pool: CommonQueryMethods) => {

    const notifications = createNotificationQueries(pool)
    const topics = createTopicQueries(pool)
    const topicSubscribers = createTopicSubscriberQueries(pool)
    const subscribers = createSubscriberQueries(pool)

    return {
        subscribers,
        notifications,
        topics,
        topicSubscribers
    }
}
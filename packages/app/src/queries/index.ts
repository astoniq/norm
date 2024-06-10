import {CommonQueryMethods} from "slonik";
import {createNotificationQueries} from "./notification.js";
import {createTopicQueries} from "./topic.js";
import {createTopicSubscriberQueries} from "./topic-subscriber.js";
import {createSubscriberQueries} from "./subscriber.js";
import {createResourceQueries} from "./resource.js";
import {createStepQueries} from "./step.js";
import {createSubscriberReferenceQueries} from "./subscriber-reference.js";
import {createConnectorQueries} from "./connector.js";
import {createTenantQueries} from "./tenant.js";

export type Queries = ReturnType<typeof createQueries>

export const createQueries = (pool: CommonQueryMethods) => {

    const notifications = createNotificationQueries(pool)
    const topics = createTopicQueries(pool)
    const topicSubscribers = createTopicSubscriberQueries(pool)
    const subscribers = createSubscriberQueries(pool)
    const resources = createResourceQueries(pool)
    const steps = createStepQueries(pool)
    const subscriberReferences = createSubscriberReferenceQueries(pool)
    const connectors = createConnectorQueries(pool)
    const tenants = createTenantQueries(pool)

    return {
        subscribers,
        tenants,
        steps,
        notifications,
        topics,
        resources,
        topicSubscribers,
        connectors,
        subscriberReferences
    }
}
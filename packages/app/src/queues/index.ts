import {createWorkflowQueue} from "./workflow.js";
import {Redis} from "ioredis";
import {createSubscriberQueue} from "./subscriber.js";

export type Queues = ReturnType<typeof createQueues>

export const createQueues = (redis: Redis) =>  {

    const workflow = createWorkflowQueue(redis)
    const subscriber = createSubscriberQueue(redis)

    return {
        workflow,
        subscriber
    }
}
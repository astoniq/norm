import {createWorkflowQueue} from "./workflow.js";
import {Redis} from "ioredis";
import {createSubscriberQueue} from "./subscriber.js";
import {createEchoQueue} from "./echo.js";

export type Queues = ReturnType<typeof createQueues>

export const createQueues = (redis: Redis) =>  {

    const workflow = createWorkflowQueue(redis)
    const subscriber = createSubscriberQueue(redis)
    const echo = createEchoQueue(redis)

    return {
        workflow,
        echo,
        subscriber
    }
}
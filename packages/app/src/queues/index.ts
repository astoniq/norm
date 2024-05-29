import {createWorkflowQueue} from "./workflow.js";
import {Redis} from "ioredis";
import {createSubscriberQueue} from "./subscriber.js";
import {createEchoQueue} from "./echo.js";
import {createMessageQueue} from "./message.js";

export type Queues = ReturnType<typeof createQueues>

export const createQueues = (redis: Redis) =>  {

    const workflow = createWorkflowQueue(redis)
    const subscriber = createSubscriberQueue(redis)
    const echo = createEchoQueue(redis)
    const message = createMessageQueue(redis)

    return {
        workflow,
        echo,
        subscriber,
        message
    }
}
import {createWorkflowQueue} from "./workflow.js";
import {Redis} from "ioredis";

export type Queues = ReturnType<typeof createQueues>

export const createQueues = (redis: Redis) =>  {

    const workflow = createWorkflowQueue(redis)

    return {
        workflow
    }
}
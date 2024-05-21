import {Queue} from "bullmq";
import {JobTopic, WorkflowJob} from "@astoniq/norm-schema";
import {JobParams} from "./types.js";
import {Redis} from "ioredis";

export const createWorkflowQueue = (redis: Redis) => {

    const queue = new Queue<WorkflowJob>(JobTopic.Workflow, {
        connection: redis,
        defaultJobOptions: {
            removeOnComplete: true
        }
    })

    const add = async (params: JobParams<WorkflowJob>) => {
        return queue.add(
            params.name,
            params.data,
            {
                removeOnComplete: true,
                removeOnFail: true,
                ...params.options
            }
        )
    }

    const close = () => queue.close()

    return {
        add,
        close
    };
}
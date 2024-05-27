import {Queue} from "bullmq";
import {EchoJob, JobTopic} from "@astoniq/norm-schema";
import {JobParams} from "./types.js";
import {Redis} from "ioredis";

export const createEchoQueue = (redis: Redis) => {

    const queue = new Queue<EchoJob>(JobTopic.Echo, {
        connection: redis,
        defaultJobOptions: {
            removeOnComplete: true
        }
    })

    const add = async (params: JobParams<EchoJob>) => {
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
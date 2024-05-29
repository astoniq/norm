import {Queue} from "bullmq";
import {JobTopic, MessageJob} from "@astoniq/norm-schema";
import {JobParams} from "./types.js";
import {Redis} from "ioredis";

export const createMessageQueue = (redis: Redis) => {

    const queue = new Queue<MessageJob>(JobTopic.Message, {
        connection: redis,
        defaultJobOptions: {
            removeOnComplete: true
        }
    })

    const add = async (params: JobParams<MessageJob>) => {
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
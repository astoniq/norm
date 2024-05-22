import {Queue} from "bullmq";
import {JobTopic, SubscriberJob} from "@astoniq/norm-schema";
import {JobParams} from "./types.js";
import {Redis} from "ioredis";

export const createSubscriberQueue = (redis: Redis) => {

    const queue = new Queue<SubscriberJob>(JobTopic.Subscriber, {
        connection: redis,
        defaultJobOptions: {
            removeOnComplete: true
        }
    })

    const add = async (params: JobParams<SubscriberJob>) => {
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

    const addBulk = async (params: JobParams<SubscriberJob>[]) => {

        const jobs = params.map(job => {
            return {
                name: job.name,
                data: job.data,
                opts: {
                    removeOnComplete: true,
                    removeOnFail: true,
                    ...job.options
                }
            }
        })

        return queue.addBulk(jobs)

    }

    const close = () => queue.close()

    return {
        addBulk,
        add,
        close
    };
}
import {Worker} from "bullmq";
import {
    JobTopic,
    SubscriberJob,
} from "@astoniq/norm-schema";
import {WorkerOptions} from "./types.js";
import * as console from "console";

export const createSubscriberWorker = (options: WorkerOptions) => {

    const {
        redis,
    } = options


    return new Worker<SubscriberJob>(JobTopic.Subscriber, async (job) => {

        console.log(job.data)

    }, {
        connection: redis
    })
}
import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {EchoJob, JobTopic} from "@astoniq/norm-schema";
import {logger} from "../utils/logger.js";


export const createMessageWorker = (options: WorkerOptions) => {

    const {
        redis,
    } = options

    return new Worker<EchoJob>(JobTopic.Message, async () => {


        let shouldQueueNextJob = true

        try {

        } catch (error) {
            logger.error(error, 'Sending message hash thrown an error')
            shouldQueueNextJob = false;
        } finally {
            if (shouldQueueNextJob) {

            }
        }

        },
        {
            connection: redis
        })
}
import {WorkerOptions} from "./types.js";
import {Worker} from "bullmq";
import {EchoJob, JobTopic} from "@astoniq/norm-schema";


export const createEchoWorker = (options: WorkerOptions) => {

    const {
        redis,
    } = options

    const sendRequest = () => {

    }

    return new Worker<EchoJob>(JobTopic.Echo, async () => {

            sendRequest()
    },
        {
            connection: redis
        })
}
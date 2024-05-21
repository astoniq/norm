import {Worker} from "bullmq";
import {JobTopic, WorkflowJob} from "@astoniq/norm-schema";
import {getWorkflowWorkerOptions} from "../config/index.js";
import * as console from "console";

export const createWorkflowWorker = () => {

    const options = getWorkflowWorkerOptions();

    return new Worker<WorkflowJob>(JobTopic.Workflow, async (job) => {
        console.log(job)
    }, {
        connection: {},
        ...options
    })
}
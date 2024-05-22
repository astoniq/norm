import {createWorkflowWorker} from "./workflow.js";
import {WorkerOptions} from "./types.js";
import {createSubscriberWorker} from "./subscriber.js";


export const createWorkers = (options: WorkerOptions) => {

    const workflow = createWorkflowWorker(options)
    const subscriber = createSubscriberWorker(options)

    return {
        workflow,
        subscriber
    }
}
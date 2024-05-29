import {createWorkflowWorker} from "./workflow.js";
import {WorkerOptions} from "./types.js";
import {createSubscriberWorker} from "./subscriber.js";
import {createEchoWorker} from "./echo.js";
import {createMessageWorker} from "./message.js";


export const createWorkers = (options: WorkerOptions) => {

    const workflow = createWorkflowWorker(options)
    const subscriber = createSubscriberWorker(options)
    const echo = createEchoWorker(options)
    const message = createMessageWorker(options)

    return {
        workflow,
        subscriber,
        message,
        echo
    }
}
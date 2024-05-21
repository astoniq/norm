import {createWorkflowWorker} from "./workflow.js";


export const createWorkers = () => {

    const workflow = createWorkflowWorker()

    return {
        workflow
    }
}
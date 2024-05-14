import {createAddJobUseCase} from "./add-job.js";
import {creatHandleLastFailedJobUseCase} from "./handle-last-failed-job.js";
import {creatQueueNextJobUseCase} from "./queue-next-job.js";

export type UseCases = ReturnType<typeof createUseCases>

export const createUseCases = () => {

    const addJob = createAddJobUseCase()
    const queueNextJob = creatQueueNextJobUseCase()
    
    const handleLastFailedJob = creatHandleLastFailedJobUseCase({
        queueNextJob
    })


    return {
        addJob,
        handleLastFailedJob,
        queueNextJob
    }

}
import {getEnv} from "@astoniq/essentials";

enum Worker {
    WORKFLOW = 'WorkflowWorker',
}

interface WorkerConfig {
    concurrency: number;
    lockDuration: number;
}

const getDefaultConcurrency = () =>
    getEnv('WORKER_DEFAULT_CONCURRENCY')
        ? Number(getEnv('WORKER_DEFAULT_CONCURRENCY'))
        : undefined;

const getDefaultLockDuration = () =>
    getEnv('WORKER_DEFAULT_LOCK_DURATION')
        ? Number(getEnv('WORKER_DEFAULT_LOCK_DURATION'))
        : undefined;

const getWorkerConfig = (worker: Worker): WorkerConfig => {
    const workersConfig = {
        [Worker.WORKFLOW]: {
            concurrency: getDefaultConcurrency() ?? 200,
            lockDuration: getDefaultLockDuration() ?? 90000,
        },
    };

    return workersConfig[worker];
};

export const getWorkflowWorkerOptions = () =>
    getWorkerConfig(Worker.WORKFLOW);

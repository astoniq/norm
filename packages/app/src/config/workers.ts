import {getEnv} from "@astoniq/essentials";

enum WorkerEnum {
    SUBSCRIBER_PROCESS = 'SubscriberProcessWorker',
    STANDARD = 'StandardWorker',
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

const getWorkerConfig = (worker: WorkerEnum): WorkerConfig => {
    const workersConfig = {
        [WorkerEnum.SUBSCRIBER_PROCESS]: {
            concurrency: getDefaultConcurrency() ?? 200,
            lockDuration: getDefaultLockDuration() ?? 90000,
        },
        [WorkerEnum.STANDARD]: {
            concurrency: getDefaultConcurrency() ?? 200,
            lockDuration: getDefaultLockDuration() ?? 90000,
        },
        [WorkerEnum.WORKFLOW]: {
            concurrency: getDefaultConcurrency() ?? 200,
            lockDuration: getDefaultLockDuration() ?? 90000,
        },
    };

    return workersConfig[worker];
};

export const getSubscriberProcessWorkerOptions = () =>
    getWorkerConfig(WorkerEnum.SUBSCRIBER_PROCESS);

export const getStandardWorkerOptions = () =>
    getWorkerConfig(WorkerEnum.STANDARD);

export const getWorkflowWorkerOptions = () =>
    getWorkerConfig(WorkerEnum.WORKFLOW);

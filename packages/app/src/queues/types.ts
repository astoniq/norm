import {JobsOptions} from "bullmq";

export interface JobParams<T> {
    name: string,
    data: T,
    options?: JobsOptions
}
import {Queries} from "../queries/index.js";
import {Redis} from "ioredis";
import {Queues} from "../queues/index.js";

export interface WorkerOptions {
    queries: Queries
    queues: Queues
    redis: Redis
}
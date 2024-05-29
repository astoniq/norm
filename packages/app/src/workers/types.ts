import {Queries} from "../queries/index.js";
import {Redis} from "ioredis";
import {Queues} from "../queues/index.js";
import {Libraries} from "../libraries/index.js";

export interface WorkerOptions {
    queries: Queries
    queues: Queues
    libraries: Libraries
    redis: Redis
}
import {Queues} from "../queues/index.js";
import {Queries} from "../queries/index.js";

export interface ApplicationContext {
    queues: Queues
    queries: Queries
}
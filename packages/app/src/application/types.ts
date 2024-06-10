import {Queues} from "../queues/index.js";
import {Queries} from "../queries/index.js";
import {Libraries} from "../libraries/index.js";

export interface ApplicationContext {
    queues: Queues
    queries: Queries
    libraries: Libraries
}
import {Subscriber} from "./subscriber.js";

export interface ExecutionEvent {
    payload: Record<string, unknown>;
    workflowId: string;
    state: ExecutionState[];
    subscriber: Subscriber;
}

export interface ExecutionState<Result = any> {
    stepId: string;
    type: string;
    result: Result;
}

export type ExecuteOutput<Output = any> = {
    status: boolean;
    output?: Output;
    stepId?: string;
    type?: string;
}
import {Subscriber} from "./subscriber.js";

export interface ExecutionEvent {
    payload: Record<string, unknown>;
    workflowId: string;
    stepId: string;
    state: ExecutionState[];
    action: ExecutionAction;
    subscriber: Subscriber;
}

export type ExecutionAction = 'execute' | 'preview'

export interface ExecutionState {
    stepId: string;
    result: Record<string, unknown>;
}

export type ExecuteOutputMetadata = {
    status: string;
    error: boolean;
    duration: number;
}

export type ExecuteOutput = {
    output: unknown;
    stepId: string;
    type: string;
    metadata: ExecuteOutputMetadata;
}
import {Subscriber} from "./subscriber.js";

export interface ExecutionEvent {
    data: Record<string, unknown>;
    workflowId: string;
    stepId: string;
    inputs: Record<string, unknown>;
    state: ExecutionState[];
    action: ExecutionAction;
    subscriber: Subscriber;
}

export type ExecutionAction = 'execute' | 'preview'

export interface ExecutionState {
    stepId: string;
    outputs: any;
    state: { status: string; error?: string };
}

export type ExecuteOutputMetadata = {
    status: string;
    error: boolean;
    duration: number;
}

export type ExecuteOutput = {
    outputs: unknown;
    metadata: ExecuteOutputMetadata;
}
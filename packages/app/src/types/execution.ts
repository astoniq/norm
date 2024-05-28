import {SubscriberDefine} from "@astoniq/norm-schema";

export interface ExecutionEvent {
    payload: Record<string, unknown>;
    workflowId: string;
    state: ExecutionState[];
    action: ExecutionAction;
    subscriber: SubscriberDefine;
}

export type ExecutionAction = 'execute' | 'preview'

export interface ExecutionState {
    stepId: string;
    type: string;
    result: Record<string, unknown>;
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
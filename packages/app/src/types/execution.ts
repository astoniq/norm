import {SubscriberDefine} from "@astoniq/norm-schema";

export interface ExecutionEvent {
    payload: Record<string, unknown>;
    workflowId: string;
    state: ExecutionState[];
    action: ExecutionAction;
    subscriber: SubscriberDefine;
}

export type ExecutionAction = 'execute' | 'preview'

export type ExecutionMetadata = {
    status: string;
    error?: string;
    duration: number;
}

export interface ExecutionState {
    stepId: string;
    type: string;
    result: unknown;
    metadata: ExecutionMetadata
}
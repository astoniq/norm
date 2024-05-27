import {SubscriberDefine} from "@astoniq/norm-schema";

export interface ExecutionEvent {
    payload: Record<string, unknown>;
    workflowId: string;
    result: ExecutionResult[];
    action: ExecutionAction;
    subscriber: SubscriberDefine;
}

export type ExecutionAction = 'execute' | 'preview'

export type ExecutionResult  = Record<string, unknown>

export type ExecuteOutputMetadata = {
    status: string;
    error: boolean;
    duration: number;
}

export type ExecuteOutput = {
    outputs: unknown;
    metadata: ExecuteOutputMetadata;
}
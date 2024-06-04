import {ConnectorType} from "@astoniq/norm-schema";
import {JsonObject, SubscriberDefine} from "@astoniq/norm-shared";

export interface ExecutionEvent {
    payload: Record<string, unknown>;
    workflowId: string;
    state: ExecutionState[];
    subscriber: SubscriberDefine;
}

export interface ExecutionState {
    stepId: string;
    type: ConnectorType;
    result: JsonObject;
}

export type ExecuteOutput = { status: true } | {
    status: false;
    output: JsonObject;
    stepId: string;
    type: ConnectorType;
}


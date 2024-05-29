import {ConnectorType, JsonObject, SubscriberDefine} from "@astoniq/norm-schema";

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

export type ExecuteOutput = {
    status: boolean;
    output?: JsonObject;
    stepId?: string;
    type?: ConnectorType;
}


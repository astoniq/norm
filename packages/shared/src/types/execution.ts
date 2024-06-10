import {ConnectorType} from "./connector.js";
import {SubscriberDefine} from "./subscriber.js";
import {JsonObject} from "./json.js";

export interface ExecutionEvent {
    payload: Record<string, unknown>;
    notificationId: string;
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


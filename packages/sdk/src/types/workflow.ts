import {Step} from "./step.js";
import {Subscriber} from "./subscriber.js";

export type WorkflowExecuteInput<Payload, Input> = {
    step: Step;
    payload: Payload;
    subscriber: Subscriber
    input: Input
}

export type WorkflowExecute<Payload, Input> = (event: WorkflowExecuteInput<Payload, Input>) => Promise<void>;

export type WorkflowOptions<PayloadSchema, InputSchema> = {
    payloadSchema?: PayloadSchema;
    inputSchema?: InputSchema
}
import {Step} from "./step.js";
import {Subscriber} from "./subscriber.js";

export type WorkflowExecuteInput<Payload> = {
    step: Step;
    payload: Payload;
    subscriber: Subscriber
}

export type WorkflowExecute<Payload> = (event: WorkflowExecuteInput<Payload>) => Promise<void>;

export type WorkflowOptions<PayloadSchema> = {
    payloadSchema?: PayloadSchema;
}
import {WorkflowExecute, WorkflowOptions} from "./workflow.js";
import {ActionStepType, ChannelStepType} from "../constants/step.js";
import {Schema} from "./schema.js";
import {ValidateFunction} from "ajv";
import {ActionStepOptions} from "./step.js";

export type StepType = `${ChannelStepType | ActionStepType}`;

export type Validate = ValidateFunction;

export type DiscoverStepOutput = {
    stepId: string;
    type: StepType;
    inputs: {
        schema: Schema;
        validate: Validate;
    },
    outputs: {
        schema: Schema
        validate: Validate;
    }
    results: {
        schema: Schema;
        validate: Validate;
    },
    resolve: (inputs: any) => any | Promise<any>;
    options: ActionStepOptions;
}

export type DiscoverWorkflowOutput = {
    workflowId: string;
    execute: WorkflowExecute<any, any>;
    options: WorkflowOptions<any, any>;
    steps: Array<DiscoverStepOutput>;
    data: {
        schema: Schema,
        validate: Validate;
    },
    inputs: {
        schema: Schema;
        validate: Validate;
    }
}

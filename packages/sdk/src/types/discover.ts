import {WorkflowExecute, WorkflowOptions} from "./workflow.js";
import {ActionStepType, ChannelStepType} from "../constants/step.js";
import {ActionStepOptions} from "./step.js";
import {ZodSchema} from "zod";

export type StepType = `${ChannelStepType | ActionStepType}`;

export type StepOutput = {
    stepId: string;
    type: StepType;
    output: ZodSchema
    result: ZodSchema
    resolve: () => any | Promise<any>;
    options: ActionStepOptions;
}

export type WorkflowOutput = {
    notificationId: string;
    execute: WorkflowExecute<any>;
    options: WorkflowOptions<any>;
    steps: Array<StepOutput>;
    payload: ZodSchema
}

export type DiscoverStepOutput = {
    stepId: string;
    type: StepType;
    output: object
    result: object
}

export type DiscoverWorkflowOutput = {
    notificationId: string;
    steps: Array<DiscoverStepOutput>;
    payload: object
}

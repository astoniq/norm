import {ClientConfig, WorkflowExecute, Schema, WorkflowOptions, ActionStep} from "./types/index.js";
import {FromSchema} from "json-schema-to-ts";
import {DiscoverStepOutput, DiscoverWorkflowOutput, StepType} from "./types/discover.js";
import { chatOutputSchema, chatResultSchema,
    emailOutputSchema,
    emailResultSchema,
    emptySchema,
    pushOutputSchema, pushResultSchema, smsOutputSchema, smsResultSchema
} from "./schemas/index.js";
import {Ajv} from "ajv"
import addFormats from "ajv-formats"
import {StepAlreadyExistsError, WorkflowAlreadyExistsError, WorkflowNotFoundError} from "./errors/index.js";


export class Echo {

    readonly config: ClientConfig;
    readonly discoveredWorkflows: Array<DiscoverWorkflowOutput> = [];
    readonly ajv: Ajv;

    constructor(config: ClientConfig) {
        this.config = config

        const ajv = new Ajv({useDefaults: true})

        addFormats.default(ajv)

        this.ajv = ajv;
    }

    public async workflow<
        PayloadSchema extends Schema,
        InputSchema extends Schema,
        Payload = FromSchema<PayloadSchema>,
        Input = FromSchema<InputSchema>>(
        workflowId: string,
        execute: WorkflowExecute<Payload, Input>,
        options?: WorkflowOptions<PayloadSchema, InputSchema>
    ): Promise<void> {
        this.discoverWorkflow(workflowId, execute, options);

        await execute({
            subscriber: {},
            input: {} as Input,
            payload: {} as Payload,
            step: {
                email: this.discoverStepFactory(
                    workflowId,
                    'email',
                    emailOutputSchema,
                    emailResultSchema
                ),
                push: this.discoverStepFactory(
                    workflowId,
                    'push',
                    pushOutputSchema,
                    pushResultSchema
                ),
                chat: this.discoverStepFactory(
                    workflowId,
                    'chat',
                    chatOutputSchema,
                    chatResultSchema
                ),
                sms: this.discoverStepFactory(
                    workflowId,
                    'sms',
                    smsOutputSchema,
                    smsResultSchema
                ),
            }
        })
    }

    private discoverStepFactory<I, T, U>(
        workflowId: string,
        type: StepType,
        outputSchema: Schema,
        resultSchema: Schema
    ): ActionStep<I, T, U> {
        return async (stepId, resolve, options = {}) => {

            const inputSchema = options?.inputSchema || emptySchema

            this.discoverStep(workflowId, stepId, {
                stepId,
                type,
                inputs: {
                    schema: inputSchema,
                    validate: this.ajv.compile(inputSchema)
                },
                outputs: {
                    schema: outputSchema,
                    validate: this.ajv.compile(outputSchema)
                },
                results: {
                    schema: resultSchema,
                    validate: this.ajv.compile(resultSchema)
                },
                resolve,
                options
            })

            return undefined as any
        }
    }

    private discoverStep(workflowId: string, stepId: string, step: DiscoverStepOutput): void {
        if (this.getWorkflow(workflowId).steps.some(workflowStep => workflowStep.stepId === stepId)) {
            throw new StepAlreadyExistsError(stepId);
        } else {
            const workflow = this.getWorkflow(workflowId);
            workflow.steps.push(step)
        }
    }

    private getWorkflow(workflowId: string): DiscoverWorkflowOutput {
        const foundWorkflow = this.discoveredWorkflows.find(workflow => workflow.workflowId === workflowId);

        if (foundWorkflow) {
            return foundWorkflow
        } else {
            throw new WorkflowNotFoundError(workflowId)
        }
    }

    private discoverWorkflow<
        PayloadSchema extends Schema,
        InputSchema extends Schema,
        Payload = FromSchema<PayloadSchema>,
        Input = FromSchema<InputSchema>
    >
    (
        workflowId: string,
        execute: WorkflowExecute<Payload, Input>,
        options: WorkflowOptions<PayloadSchema, InputSchema> = {}
    ): void {
        if (this.discoveredWorkflows.some(workflow => workflow.workflowId === workflowId)) {
            throw new WorkflowAlreadyExistsError(workflowId)
        } else {
            this.discoveredWorkflows.push({
                workflowId,
                options,
                steps: [],
                data: {
                    schema: options.payloadSchema || emptySchema,
                    validate: this.ajv.compile(options.payloadSchema || emptySchema)
                },
                inputs: {
                    schema: options.inputSchema || emptySchema,
                    validate: this.ajv.compile(options.inputSchema || emptySchema)
                },
                execute
            })
        }
    }
}
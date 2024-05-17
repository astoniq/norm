import {
    ClientConfig,
    WorkflowExecute,
    Schema,
    WorkflowOptions,
    ActionStep,
    ExecutionEvent,
    ExecuteOutput
} from "./types/index.js";
import {FromSchema} from "json-schema-to-ts";
import {DiscoverStepOutput, DiscoverWorkflowOutput, StepType, Validate} from "./types/discover.js";
import {
    chatOutputSchema, chatResultSchema,
    emailOutputSchema,
    emailResultSchema,
    emptySchema,
    pushOutputSchema, pushResultSchema, smsOutputSchema, smsResultSchema
} from "./schemas/index.js";
import {Ajv, ValidateFunction} from "ajv"
import addFormats from "ajv-formats"
import {
    ExecutionEventDataInvalidError,
    ExecutionEventInputInvalidError, ExecutionStateCorruptError,
    ExecutionStateInputInvalidError,
    ExecutionStateOutputInvalidError,
    ExecutionStateResultInvalidError,
    StepAlreadyExistsError, StepNotFoundError,
    WorkflowAlreadyExistsError,
    WorkflowNotFoundError
} from "./errors/index.js";
import * as process from "process";
import {HealthCheck} from "./constants/index.js";


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

    public healthCheck(): HealthCheck {
        const workflowCount = this.discoveredWorkflows.length;
        const stepCount = this.discoveredWorkflows.reduce((acc, workflow) => acc + workflow.steps.length, 0);

        return {
            status: 'ok',
            discover: {
                workflows: workflowCount,
                steps: stepCount,
            },
        };
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

    public getRegisteredWorkflows(): Array<DiscoverWorkflowOutput> {
        return this.discoveredWorkflows;
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

    private validate(
        data: unknown,
        validate: Validate,
        component: 'event' | 'step',
        payloadType: 'input' | 'output' | 'result' | 'data',
        workflowId: string,
        stepId?: string): void {

        const valid = validate(data)

        if (!valid) {
            switch (component) {
                case "event":
                    this.validateEvent(payloadType, workflowId, validate)
                    break;
                case "step":
                    this.validateStep(stepId, payloadType, workflowId, validate)
                    break;
                default:
                    throw new Error(`Invalid component type ${component}`)
            }
        }
    }

    private validateEvent(
        payloadType: 'input' | 'output' | 'result' | 'data',
        workflowId: string,
        validate: ValidateFunction
    ) {
        switch (payloadType) {
            case "input":
                throw new ExecutionEventInputInvalidError(workflowId, validate.errors)
            case "data":
                throw new ExecutionEventDataInvalidError(workflowId, validate.errors);
            default:
                throw new Error(`Invalid payload type '${payloadType}'`)
        }
    }

    private validateStep(
        stepId: string | undefined,
        payloadType: 'input' | 'output' | 'result' | 'data',
        workflowId: string,
        validate: ValidateFunction
    ) {
        if (!stepId) {
            throw new Error('stepId is required');
        }

        switch (payloadType) {
            case 'output':
                throw new ExecutionStateOutputInvalidError(workflowId, stepId, validate.errors);

            case 'result':
                throw new ExecutionStateResultInvalidError(workflowId, stepId, validate.errors);

            case 'input':
                throw new ExecutionStateInputInvalidError(workflowId, stepId, validate.errors);

            default:
                throw new Error(`Invalid payload type: '${payloadType}'`);
        }
    }

    private checkEventData(event: ExecutionEvent) {
        if (event.action === 'execute' && !event.data) {
            throw new ExecutionEventInputInvalidError(event.workflowId, {
                message: 'Event `data` is required'
            })
        }
    }

    public async executeWorkflow(event: ExecutionEvent): Promise<ExecuteOutput> {

        const workflow = this.getWorkflow(event.workflowId);

        const startTime = process.hrtime();

        let result: {
            outputs: Record<string, unknown>
        } = {
            outputs: {}
        }

        let resolveEarlyExit: (value?: unknown) => void;
        const earlyExitPromise = new Promise(resolve => {
            resolveEarlyExit = resolve
        })

        const setResult = (stepResult: any): void => {
            resolveEarlyExit()
            result = stepResult
        }

        let executionError: Error | unknown;
        try {

            this.checkEventData(event)

            const executionData = this.createExecutionInputs(event, workflow);
            await Promise.race([
                earlyExitPromise,
                workflow.execute({
                    payload: executionData,
                    input: {},
                    subscriber: event.subscriber,
                    step: {
                        email: this.executeStepFactory(event, setResult),
                        sms: this.executeStepFactory(event, setResult),
                        chat:  this.executeStepFactory(event, setResult),
                        push:  this.executeStepFactory(event, setResult)
                    }
                })
            ])
        } catch (error) {
            executionError = error
        }

        const endTime = process.hrtime(startTime);

        const elapsedSeconds = endTime[0];
        const elapsedNanoseconds = endTime[1];
        const elapsedTimeInMilliseconds = elapsedSeconds * 1000 + elapsedNanoseconds / 1_000_000;

        if (executionError) {
            throw executionError;
        }

        return  {
            outputs: result.outputs,
            metadata: {
                status: 'success',
                error: false,
                duration: elapsedTimeInMilliseconds
            }
        }
    }

    private getStep(workflowId: string, stepId: string): DiscoverStepOutput {
        const workflow = this.getWorkflow(workflowId)

        const foundStep = workflow.steps.find(step => step.stepId === stepId);

        if (foundStep) {
            return foundStep
        } else {
            throw new StepNotFoundError(stepId)
        }
    }

    private executeStepFactory<I, T, U>(event: ExecutionEvent, setResult: (result: any) => void): ActionStep<I, T, U> {
        return async (stepId, resolve) => {
            const step = this.getStep(event.workflowId, stepId)

            const previewStepHandler = this.previewStep.bind(this);
            const executeStepHandler = this.executeStep.bind(this);

            const handler = event.action === 'preview' ? previewStepHandler : executeStepHandler;

            const stepResult = await handler(event, {
                ...step,
                resolve
            });

            if (stepId === event.stepId) {
                setResult(stepResult)
            }

            return stepResult.outputs as any;
        }
    }

    private async executeStep(
        event: ExecutionEvent,
        step: DiscoverStepOutput
    ): Promise<Pick<ExecuteOutput, 'outputs'>> {
        if (event.stepId === step.stepId) {
            const input = this.createStepInputs(event, step)
            const result = await step.resolve(input);

            this.validate(
                result,
                step.outputs.validate,
                'step',
                'output',
                event.workflowId,
                step.stepId
            )

            return {
                outputs: result
            }
        } else {
            const result = event.state.find(state => state.stepId === step.stepId)

            if (result) {
                this.validate(
                    result.outputs,
                    step.results.validate,
                    'step',
                    'result',
                    event.workflowId,
                    step.stepId
                )
                return {
                    outputs: result.outputs
                }
            } else {
                throw new ExecutionStateCorruptError(event.workflowId, step.stepId)
            }
        }
    }

    private async previewStep(
        event: ExecutionEvent,
        step: DiscoverStepOutput
    ): Promise<Pick<ExecuteOutput, 'outputs'>> {
        if (event.stepId === step.stepId) {
            const input = this.createStepInputs(event, step)
            const result = await step.resolve(input);

            this.validate(
                result,
                step.outputs.validate,
                'step',
                'output',
                event.workflowId,
                step.stepId
            )

            return {
                outputs: result
            }
        } else {
            throw new ExecutionStateCorruptError(event.workflowId, step.stepId)
        }
    }

    private createStepInputs(event: ExecutionEvent, step: DiscoverStepOutput): Record<string, unknown> {
        const stepInputs = event.inputs;

        this.validate(stepInputs, step.inputs.validate, 'step', 'input', event.workflowId, step.stepId)

        return stepInputs;
    }

    private createExecutionInputs(event: ExecutionEvent, workflow: DiscoverWorkflowOutput): Record<string, unknown> {
        const executionData = event.data;

        this.validate(executionData, workflow.data.validate, 'event', 'input', event.workflowId)

        return executionData;
    }
}
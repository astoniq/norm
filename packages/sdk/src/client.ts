import {
    ActionStep,
    AppStep,
    ClientConfig,
    ExecuteOutput,
    ExecutionEvent,
    Subscriber,
    WorkflowExecute,
    WorkflowOptions
} from "./types/index.js";
import { DiscoverWorkflowOutput, StepOutput, StepType, WorkflowOutput} from "./types/discover.js";
import {
    chatOutputSchema,
    chatResultSchema,
    emailOutputSchema,
    emailResultSchema,
    emptySchema,
    pushOutputSchema,
    pushResultSchema,
    smsOutputSchema,
    smsResultSchema
} from "./schemas/index.js";
import {
    ExecutionEventDataInvalidError,
    ExecutionEventInputInvalidError,
    ExecutionStateOutputInvalidError,
    ExecutionStateResultInvalidError,
    StepAlreadyExistsError,
    StepNotFoundError,
    WorkflowAlreadyExistsError,
    WorkflowNotFoundError
} from "./errors/index.js";
import {HealthCheck} from "./constants/index.js";
import {ZodError, ZodSchema} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";


export class Echo {

    readonly config: ClientConfig;
    readonly workflows: Array<WorkflowOutput> = [];

    constructor(config: ClientConfig) {
        this.config = config
    }

    public healthCheck(): HealthCheck {
        const workflowCount = this.workflows.length;
        const stepCount = this.workflows.reduce((acc, workflow) => acc + workflow.steps.length, 0);

        return {
            status: 'ok',
            discover: {
                workflows: workflowCount,
                steps: stepCount,
            },
        };
    }

    public async workflow<Payload>(
        workflowId: string,
        execute: WorkflowExecute<Payload>,
        options?: WorkflowOptions<Payload>
    ): Promise<void> {
        this.discoverWorkflow(workflowId, execute, options);

        await execute({
            subscriber: {} as Subscriber,
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
                app: this.discoveryAppStepFactory(
                    workflowId,
                    'app'
                )
            }
        })
    }

    private discoveryAppStepFactory(workflowId: string, type: StepType): AppStep {
        return async (stepId, resolve, options = {}) => {

            const resultSchema = options?.resultSchema || emptySchema;
            const outputSchema = options?.outputSchema || emptySchema;

            this.discoverStep(workflowId, stepId, {
                stepId,
                type,
                output: outputSchema,
                result: resultSchema,
                resolve,
                options,
            });

            return undefined as any;
        };
    }

    private discoverStepFactory<O, R>(
        workflowId: string,
        type: StepType,
        outputSchema: ZodSchema,
        resultSchema: ZodSchema
    ): ActionStep<O, R> {
        return async (stepId, resolve, options = {}) => {

            this.discoverStep(workflowId, stepId, {
                stepId,
                type,
                output: outputSchema,
                result: resultSchema,
                resolve,
                options
            })

            return undefined as any
        }
    }

    public getRegisteredWorkflows(): Array<DiscoverWorkflowOutput> {
        return this.workflows.map(workflow => {

            const {
                workflowId,
                steps: workflowSteps
            } =workflow

            const steps = workflowSteps.map(step => {
                return {
                    stepId: step.stepId,
                    type: step.type,
                    output: zodToJsonSchema(step.output),
                    result: zodToJsonSchema(step.result)
                }
            })

            return {
                workflowId,
                steps,
                payload: zodToJsonSchema(workflow.payload)
            }
        });
    }


    private discoverStep(workflowId: string, stepId: string, step: StepOutput): void {
        if (this.getWorkflow(workflowId).steps.some(workflowStep => workflowStep.stepId === stepId)) {
            throw new StepAlreadyExistsError(stepId);
        } else {
            const workflow = this.getWorkflow(workflowId);
            workflow.steps.push(step)
        }
    }

    private getWorkflow(workflowId: string): WorkflowOutput {
        const foundWorkflow = this.workflows.find(workflow => workflow.workflowId === workflowId);

        if (foundWorkflow) {
            return foundWorkflow
        } else {
            throw new WorkflowNotFoundError(workflowId)
        }
    }

    private discoverWorkflow<Payload>
    (
        workflowId: string,
        execute: WorkflowExecute<Payload>,
        options: WorkflowOptions<Payload> = {}
    ): void {
        if (this.workflows.some(workflow => workflow.workflowId === workflowId)) {
            throw new WorkflowAlreadyExistsError(workflowId)
        } else {
            this.workflows.push({
                workflowId,
                options,
                steps: [],
                payload: options.payloadSchema || emptySchema,
                execute
            })
        }
    }

    private validate(
        data: unknown,
        schema: ZodSchema,
        component: 'event' | 'step',
        payloadType: 'output' | 'result' | 'payload',
        workflowId: string,
        stepId?: string): void {

        const valid = schema.safeParse(data)

        if (!valid.success) {
            switch (component) {
                case "event":
                    this.validateEvent(payloadType, workflowId, valid.error)
                    break;
                case "step":
                    this.validateStep(stepId, payloadType, workflowId, valid.error)
                    break;
                default:
                    throw new Error(`Invalid component type ${component}`)
            }
        }
    }

    private formatZodError({issues}: ZodError): string {
        const errors = issues.map((issue) => {
            const base = `Error in key path "${issue.path.map(String).join('.')}": (${issue.code}) `;

            if (issue.code === 'invalid_type') {
                return base + `Expected ${issue.expected} but received ${issue.received}.`;
            }

            return base + issue.message;
        });

        return errors.join('\n')
    }

    private validateEvent(
        payloadType: 'output' | 'result' | 'payload',
        workflowId: string,
        error: ZodError
    ) {
        switch (payloadType) {
            case "payload":
                throw new ExecutionEventDataInvalidError(workflowId, this.formatZodError(error));
            default:
                throw new Error(`Invalid payload type '${payloadType}'`)
        }
    }

    private validateStep(
        stepId: string | undefined,
        payloadType: 'output' | 'result' | 'payload',
        workflowId: string,
        error: ZodError
    ) {
        if (!stepId) {
            throw new Error('stepId is required');
        }

        switch (payloadType) {
            case 'output':
                throw new ExecutionStateOutputInvalidError(workflowId, stepId, this.formatZodError(error));

            case 'result':
                throw new ExecutionStateResultInvalidError(workflowId, stepId, this.formatZodError(error));
            default:
                throw new Error(`Invalid payload type: '${payloadType}'`);
        }
    }

    private checkEvenPayload(event: ExecutionEvent) {
        if (!event.payload) {
            throw new ExecutionEventInputInvalidError(event.workflowId, {
                message: 'Event `data` is required'
            })
        }
    }

    public async executeWorkflow(event: ExecutionEvent): Promise<ExecuteOutput> {

        const workflow = this.getWorkflow(event.workflowId);

        let result: ExecuteOutput = {
            status: true
        }

        let resolveEarlyExit: (value?: unknown) => void;
        const earlyExitPromise = new Promise(resolve => {
            resolveEarlyExit = resolve
        })

        const setResult = (stepResult: ExecuteOutput): void => {
            resolveEarlyExit()
            result = stepResult
        }

        this.checkEvenPayload(event)

        const executionData = this.createExecutionInputs(event, workflow);
        await Promise.race([
            earlyExitPromise,
            workflow.execute({
                payload: executionData,
                subscriber: event.subscriber,
                step: {
                    email: this.executeStepFactory(event, setResult),
                    sms: this.executeStepFactory(event, setResult),
                    chat: this.executeStepFactory(event, setResult),
                    push: this.executeStepFactory(event, setResult),
                    app: this.executeStepFactory(event, setResult),
                }
            })
        ])

        return result
    }

    private getStep(workflowId: string, stepId: string): StepOutput {
        const workflow = this.getWorkflow(workflowId)

        const foundStep = workflow.steps.find(step => step.stepId === stepId);

        if (foundStep) {
            return foundStep
        } else {
            throw new StepNotFoundError(stepId)
        }
    }

    private executeStepFactory<O, R>(event: ExecutionEvent, setResult: (result: ExecuteOutput<O>) => void): ActionStep<O, R> {
        return async (stepId, resolve) => {
            const step = this.getStep(event.workflowId, stepId)

            return this.executeStep(event, setResult, {
                ...step,
                resolve
            });
        }
    }

    private async executeStep<O, R>(
        event: ExecutionEvent,
        setResult: (result: ExecuteOutput<O>) => void,
        step: StepOutput
    ): Promise<R> {

        const {stepId, type} = step

        const state = event.state.find(
            state => state.stepId === step.stepId)

        if (state) {
            this.validate(
                state.result,
                step.result,
                'step',
                'result',
                event.workflowId,
                step.stepId
            )

            return state.result
        } else {

            const output = await step.resolve();

            this.validate(
                output,
                step.output,
                'step',
                'output',
                event.workflowId,
                step.stepId
            )

            setResult({
                stepId,
                type,
                output,
                status: false
            })

            return undefined as any
        }
    }

    private createExecutionInputs(event: ExecutionEvent, workflow: WorkflowOutput): Record<string, unknown> {
        const executionData = event.payload;

        this.validate(executionData, workflow.payload, 'event', 'payload', event.workflowId)

        return executionData;
    }
}
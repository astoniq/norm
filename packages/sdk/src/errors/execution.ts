import {BadRequestError} from "./base.js";
import {ErrorCodeType} from "../constants/index.js";

export class ExecutionStateCorruptError extends BadRequestError {
    code = ErrorCodeType.EXECUTION_STATE_CORRUPT_ERROR;

    constructor(notificationId: string, stepId: string) {
        super(
            `Workflow with id: \`${notificationId}\` has a corrupt state. Step with id: \`${stepId}\` does not exist. Please provide the missing state.`
        );
        this.data = { notificationId, stepId };
    }
}

export class ExecutionEventDataInvalidError extends BadRequestError {
    code = ErrorCodeType.EXECUTION_EVENT_DATA_INVALID_ERROR;

    constructor(notificationId: string, data: any) {
        super(`Workflow with id: \`${notificationId}\` has invalid \`data\`. Please provide the correct event data.`);
        this.data = data;
    }
}

export class ExecutionEventInputInvalidError extends BadRequestError {
    code = ErrorCodeType.EXECUTION_EVENT_INPUT_INVALID_ERROR;

    constructor(notificationId: string, data: any) {
        super(`Workflow with id: \`${notificationId}\` has invalid \`inputs\`. Please provide the correct event inputs.`);
        this.data = data;
    }
}

export class ExecutionStateInputInvalidError extends BadRequestError {
    code = ErrorCodeType.EXECUTION_STATE_INPUT_INVALID_ERROR;

    constructor(notificationId: string, stepId: string, data: any) {
        super(
            `Workflow with id: \`${notificationId}\` has an invalid state. Step with id: \`${stepId}\` has invalid input. Please provide the correct step input.`
        );
        this.data = data;
    }
}

export class ExecutionStateOutputInvalidError extends BadRequestError {
    code = ErrorCodeType.EXECUTION_STATE_OUTPUT_INVALID_ERROR;

    constructor(notificationId: string, stepId: string, data: any) {
        super(
            `Workflow with id: \`${notificationId}\` has an invalid state. Step with id: \`${stepId}\` has invalid output. Please provide the correct step output.`
        );
        this.data = data;
    }
}

export class ExecutionStateResultInvalidError extends BadRequestError {
    code = ErrorCodeType.EXECUTION_STATE_RESULT_INVALID_ERROR;

    constructor(notificationId: string, stepId: string, data: any) {
        super(
            `Workflow with id: \`${notificationId}\` has an invalid state. Step with id: \`${stepId}\` has invalid result. Please provide the correct step result.`
        );
        this.data = data;
    }
}

export class ExecutionProviderOutputInvalidError extends BadRequestError {
    code = ErrorCodeType.EXECUTION_PROVIDER_OUTPUT_INVALID_ERROR;

    constructor(notificationId: string, stepId: string, providerId: string, data: any) {
        super(
            `Workflow with id: \`${notificationId}\` has an invalid state. Step with id: \`${stepId}\` and provider with id: \`${providerId}\` has invalid output. Please provide the correct provider output.`
        );
        this.data = data;
    }
}
import {ErrorCodeType, ResourceType} from "../constants/index.js";
import {ResourceConflictError, ResourceExecutionFailed, ResourceNotFoundError} from "./resource.js";

export class StepNotFoundError extends ResourceNotFoundError {
    code = ErrorCodeType.STEP_NOT_FOUND_ERROR;

    constructor(id: string) {
        super(ResourceType.Step, id);
    }
}


export class StepAlreadyExistsError extends ResourceConflictError {
    code = ErrorCodeType.STEP_ALREADY_EXISTS_ERROR;

    constructor(id: string) {
        super(ResourceType.Step, id);
    }
}

export class StepExecutionFailedError extends ResourceExecutionFailed {
    code = ErrorCodeType.STEP_EXECUTION_FAILED_ERROR;

    constructor(id: string) {
        super(ResourceType.Workflow, id);
    }
}
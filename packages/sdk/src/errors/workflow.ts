import {ErrorCodeType, ResourceType} from "../constants/index.js";
import {ResourceConflictError, ResourceExecutionFailed, ResourceNotFoundError} from "./resource.js";


export class WorkflowNotFoundError extends ResourceNotFoundError {
    code = ErrorCodeType.WORKFLOW_NOT_FOUND_ERROR;

    constructor(id: string) {
        super(ResourceType.Workflow, id);
    }
}

export class WorkflowAlreadyExistsError extends ResourceConflictError {
    code = ErrorCodeType.WORKFLOW_ALREADY_EXISTS_ERROR;

    constructor(id: string) {
        super(ResourceType.Workflow, id);
    }
}

export class WorkflowExecutionFailedError extends ResourceExecutionFailed {
    code = ErrorCodeType.WORKFLOW_EXECUTION_FAILED_ERROR;

    constructor(id: string) {
        super(ResourceType.Workflow, id);
    }
}
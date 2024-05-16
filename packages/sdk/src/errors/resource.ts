import {ConflictError, InternalServerError, NotFoundError} from "./base.js";
import {ResourceType} from "../constants/index.js";
import {toPascalCase} from "../utils/index.js";

export abstract class ResourceConflictError extends ConflictError {
    protected constructor(resource: ResourceType, id: string) {
        super(`${toPascalCase(resource)} with id: \`${id}\` already exists. Please use a different id.`);
    }
}

export abstract class ResourceNotFoundError extends NotFoundError {
    protected constructor(resource: ResourceType, id: string) {
        super(`${toPascalCase(resource)} with id: \`${id}\` does not exist. Please provide a valid id.`);
    }
}

export abstract class ResourceExecutionFailed extends InternalServerError {
    protected constructor(resource: ResourceType, id: string) {
        super(`Failed to execute ${toPascalCase(resource)} with id: \`${id}\`. Please try again later.`);
    }
}

export abstract class ResourcePreviewFailed extends InternalServerError {
    constructor(resource: ResourceType, id: string) {
        super(`Failed to preview ${toPascalCase(resource)} with id: \`${id}\`. Please try again later.`);
    }
}
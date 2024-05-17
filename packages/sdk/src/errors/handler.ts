import {BadRequestError, EchoError} from "./base.js";
import {enumToPrettyString} from "../utils/index.js";
import {ErrorCodeType, HttpMethodType, HttpStatusType} from "../constants/index.js";

export class MethodNotAllowedError extends EchoError {
    code = ErrorCodeType.METHOD_NOT_ALLOWED_ERROR;

    statusCode = HttpStatusType.METHOD_NOT_ALLOWED;

    message = `Method not allowed. Please use one of ${enumToPrettyString(HttpMethodType)}`;
}

export class InvalidActionError extends BadRequestError {
    code = ErrorCodeType.INVALID_ACTION_ERROR;

    // eslint-disable-next-line  @typescript-eslint/ban-types
    constructor(action: string, allowedActions: Object) {
        super(`Invalid query string: \`action\`=\`${action}\`. Please use one of ${enumToPrettyString(allowedActions)}`);
    }
}

export class MissingApiKeyError extends BadRequestError {
    code = ErrorCodeType.MISSING_API_KEY_ERROR;

    constructor() {
        super(`API Key is missing. Please add the API Key during Echo client initialization.`);
    }
}
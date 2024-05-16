import {ErrorCodeType, HttpStatusType} from "../constants/index.js";

export abstract class EchoError extends Error {
    public abstract readonly statusCode: HttpStatusType;
    public data?: any;
    public abstract readonly code: ErrorCodeType
}

export abstract class NotFoundError extends EchoError {
    statusCode = HttpStatusType.NOT_FOUND;
}

export abstract class BadRequestError extends EchoError {
    statusCode = HttpStatusType.BAD_REQUEST;
}

export abstract class UnauthorizedError extends EchoError {
    statusCode = HttpStatusType.UNAUTHORIZED;
}

export abstract class InternalServerError extends EchoError {
    statusCode = HttpStatusType.INTERNAL_SERVER_ERROR;
}

export abstract class ConflictError extends EchoError {
    statusCode = HttpStatusType.CONFLICT;
}

export abstract class ForbiddenError extends EchoError {
    statusCode = HttpStatusType.FORBIDDEN;
}
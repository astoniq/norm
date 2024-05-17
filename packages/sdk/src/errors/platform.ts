import {InternalServerError} from "./base.js";
import {ErrorCodeType} from "../constants/index.js";

export class PlatformError extends InternalServerError {
    code = ErrorCodeType.PLATFORM_ERROR;

    message = 'Something went wrong. Please try again later.';
}
import {ErrorResponse} from "./types.js";

export class NormError extends Error {
    public readonly code: string

    public constructor(code: string, message: string) {
        super();
        this.message = message;
        this.code = code;
    }

    public static fromResponse({message, code}: ErrorResponse) {
        return new NormError(code, message);
    }

    public override toString() {
        return JSON.stringify(
            {
                message: this.message,
                code: this.code,
            },
            null,
            2,
        );
    }
}

export const isNormErrorResponse = (
    response: unknown,
): response is ErrorResponse => {
    if (typeof response !== 'object' || response === null) {
        return false;
    }

    const error = response as ErrorResponse;

    if (typeof error !== 'object' || error === null) {
        return false;
    }

    const { message, code } = error;

    return typeof message === 'string' && typeof code === 'string';
};
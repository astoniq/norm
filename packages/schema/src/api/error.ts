import {NormErrorCode} from "@astoniq/norm-phrase";

export type RequestErrorMetadata = Record<string, unknown> & {
    code: NormErrorCode;
    status?: number;
    expose?: boolean;
}

export type RequestErrorBody<T = unknown> = {
    message: string
    data: T
    code: NormErrorCode;
    details?: string
}
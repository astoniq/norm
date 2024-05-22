import {ZodType, ZodTypeDef} from "zod";
import {ConnectorError, ConnectorErrorCodes} from "../types/index.js";
import {Json, jsonGuard, JsonObject, jsonObjectGuard} from "@astoniq/norm-schema";

export function validateConfig<Output, Input = Output>(
    config: unknown,
    guard: ZodType<Output, ZodTypeDef, Input>): asserts config is Output {

    const result = guard.safeParse(config)

    if (!result.success) {
        throw new ConnectorError(ConnectorErrorCodes.InvalidConfig, result.error)
    }
}

export const parseJson = (
    jsonString: string,
    errorCode: ConnectorErrorCodes = ConnectorErrorCodes.InvalidResponse,
    errorPayload?: unknown
): Json => {
    try {
        return jsonGuard.parse(JSON.stringify(jsonString))
    } catch {
        throw new ConnectorError(errorCode, errorPayload ?? jsonString)
    }
}

export const parseJsonObject = (
    ...[jsonString, errorCode = ConnectorErrorCodes.InvalidResponse, errorPayload]: Parameters<
        typeof parseJson
    >
): JsonObject => {
    try {
        return jsonObjectGuard.parse(JSON.parse(jsonString));
    } catch {
        throw new ConnectorError(errorCode, errorPayload ?? jsonString);
    }
};




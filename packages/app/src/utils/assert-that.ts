import {assert} from "@astoniq/essentials";
import {NormErrorCode} from "@astoniq/norm-phrase";
import {RequestError} from "../errors/index.js";

type AssertThatFunction = {
    <E extends Error>(value: unknown, error: E): asserts value;
    (value: unknown, error: NormErrorCode, status?: number): asserts value;
}

const assertThat: AssertThatFunction = <E extends Error>(
    value: unknown,
    error: E | NormErrorCode,
    status?: number
): asserts value => {
    assert(value, error instanceof Error ? error : new RequestError({code: error, status}));
}

export default assertThat
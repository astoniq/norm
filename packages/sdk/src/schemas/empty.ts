import {Schema} from "../types/index.js";

export const emptySchema = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false
} as const satisfies Schema
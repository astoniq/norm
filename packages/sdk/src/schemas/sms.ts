import {Schema} from "../types/index.js";

export const smsOutputSchema = {
    type: 'object',
    properties: {
        body: { type: 'string' },
    },
    required: ['body'],
    additionalProperties: false,
} as const satisfies Schema;

export const smsResultSchema = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
} as const satisfies Schema;

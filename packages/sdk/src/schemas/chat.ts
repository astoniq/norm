import {Schema} from "../types/index.js";

export const chatOutputSchema = {
    type: 'object',
    properties: {
        body: { type: 'string' },
    },
    required: ['body'],
    additionalProperties: false,
} as const satisfies Schema;

export const chatResultSchema = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
} as const satisfies Schema;

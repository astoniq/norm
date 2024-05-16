import {Schema} from "../types/index.js";

export const emailOutputSchema = {
    type: 'object',
    properties: {
        subject: { type: 'string' },
        body: { type: 'string' },
    },
    required: ['subject', 'body'],
    additionalProperties: false,
} as const satisfies Schema;

export const emailResultSchema = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
} as const satisfies Schema;

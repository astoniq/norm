import {Schema} from "../types/index.js";

export const pushOutputSchema = {
    type: 'object',
    properties: {
        subject: { type: 'string' },
        body: { type: 'string' },
    },
    required: ['subject', 'body'],
    additionalProperties: false,
} as const satisfies Schema;

export const pushResultSchema = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
} as const satisfies Schema;

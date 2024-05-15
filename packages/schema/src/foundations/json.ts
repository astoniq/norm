import { z } from 'zod';

export type Json = JsonObject | JsonArray | string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = {
    [key: string]: Json;
};

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const jsonGuard: z.ZodType<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(jsonGuard), z.record(jsonGuard)])
);

export const jsonObjectGuard = z.record(jsonGuard);
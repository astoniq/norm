import {ZodObject, ZodRawShape} from "zod";

export const zodKeys = <T extends ZodRawShape>(schema: ZodObject<T>) => schema.keyof()

import {z, ZodSchema} from "zod";
import {
    defaultPaginationPageSize,
    defaultPaginationPageNumber,
    defaultPaginationMaxSize
} from "../consts/index.js";

export const paginationGuard = z.object({
    page: z.coerce.number().positive().default(defaultPaginationPageNumber),
    pageSize: z.coerce.number().positive().max(defaultPaginationMaxSize).default(defaultPaginationPageSize)
}).transform(({page, pageSize}) => ({
    page,
    pageSize,
    offset: (page - 1) * pageSize
}))

export type Pagination = z.infer<typeof paginationGuard>;

export const createPaginationResponseGuard = <T>(schema: ZodSchema<T>) => z.object({
    page: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    items: z.array(schema)
})
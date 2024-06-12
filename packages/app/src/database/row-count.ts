import {CommonQueryMethods, IdentifierSqlToken, sql} from "slonik";
import {buildSearchSql, SearchOptions} from "./utils.js";
import {Entity, EntityLike} from "../types/index.js";
import {z} from "zod";

const countGuard = z.object({
    count: z.number(),
})

export const buildGetTotalRowCountWithPool =
    <
        T extends EntityLike<T>,
        P extends Partial<T>,
    >(pool: CommonQueryMethods, entity: Entity<T, P>) => async (search?: SearchOptions<T>) => {
        const {count} = await pool.one(sql.type(countGuard)`
            select count(*)
            from ${sql.identifier([entity.table])} ${buildSearchSql(entity, search)}
        `)

        return {count: Number(count)}
    }

export const getTotalRowCountWithPool =
    (pool: CommonQueryMethods) => async (table: IdentifierSqlToken) => {
        const {count} = await pool.one(sql.type(countGuard)`
            select count(*)
            from ${table}
        `)

        return {count: Number(count)}
    }
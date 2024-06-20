import {CommonQueryMethods, IdentifierSqlToken, sql, SqlToken} from "slonik";
import {Entity, EntityLike} from "../types/index.js";
import {z} from "zod";
import {buildConditionSql} from "./utils.js";

const countGuard = z.object({
    count: z.number(),
})

export const buildGetTotalRowCountWithPool =
    <
        T extends EntityLike<T>,
        P extends Partial<T>,
    >(pool: CommonQueryMethods, entity: Entity<T, P>) => async (conditionSql?: SqlToken) => {
        const {count} = await pool.one(sql.type(countGuard)`
            select count(*)
            from ${sql.identifier([entity.table])} ${buildConditionSql(conditionSql)}
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
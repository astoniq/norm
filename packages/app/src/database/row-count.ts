import {CommonQueryMethods, FragmentSqlToken, sql} from "slonik";
import {Entity, EntityLike} from "../types/index.js";
import {z} from "zod";
import {buildConditionSql} from "../utils/sql.js";

const countGuard = z.object({
    count: z.number(),
})

export const buildGetTotalRowCountWithPool =
    <
        T extends EntityLike<T>,
        P extends Partial<T>,
    >(pool: CommonQueryMethods, entity: Entity<T, P>) => async (conditionSql?: FragmentSqlToken) => {
        const {count} = await pool.one(sql.type(countGuard)`
            select count(*)
            from ${sql.identifier([entity.table])} ${buildConditionSql(conditionSql)}
        `)

        return Number(count)
    }

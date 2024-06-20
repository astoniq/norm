import {sql, SqlToken} from "slonik";
import {EntityLike} from "../types/index.js";
import {conditionalSql, FiledIdentifiers} from "../utils/sql.js";

export const buildConditionSql = (
    conditionSql?: SqlToken,
    prefixSql: SqlToken = sql.fragment`where `
) => {
    return conditionalSql(conditionSql, (conditionSql) => {
        return sql.fragment`${prefixSql}(${conditionSql})`
    })
}

export const expandFields = <T extends EntityLike<T>>(fields: FiledIdentifiers<T>) => {
    return sql.join(Object.values(fields), sql.fragment`, `)
}
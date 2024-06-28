import {CommonQueryMethods, FragmentSqlToken, sql} from "slonik";
import {Entity, EntityKeys, EntityLike} from "../types/index.js";
import {buildConditionSql, conditionalSql, convertToIdentifiers, expandFields, manyRows} from "../utils/sql.js";

type FindAllConfig<Keys> = {
    limit?: number,
    offset?: number,
    conditionSql?: FragmentSqlToken,
    orderBy?: Array<{
        field: Keys,
        order: 'asc' | 'desc'
    }>,
};

export const buildFindEntitiesWithPool = <
    T extends EntityLike<T>,
    P extends Partial<T>,
    Keys extends EntityKeys<T>,
>(
    pool: CommonQueryMethods,
    entity: Entity<T, P>,
) => {
    const {table, fields} = convertToIdentifiers(entity);

    return async (
        {conditionSql, offset, limit, orderBy}: FindAllConfig<Keys>
    ) => manyRows(
        pool.query(sql.type(entity.guard)`
            select ${expandFields(fields)}
            from ${table} ${buildConditionSql(conditionSql)} ${conditionalSql(orderBy, (orderBy) => {
                const orderBySql = orderBy.map(({order, field}) =>
                        order === 'desc' ? sql.fragment`${fields[field]} desc` : sql.fragment`${fields[field]} asc`
                )
                return sql.fragment`order by ${sql.join(orderBySql, sql.fragment`, `)}`
            })} ${conditionalSql(limit, (limit) => sql.fragment`limit ${limit}`)}
                ${conditionalSql(offset, (offset) => sql.fragment`offset ${offset}`)}
        `)
    )
}
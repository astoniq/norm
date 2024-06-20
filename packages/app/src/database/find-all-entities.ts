import {CommonQueryMethods, sql} from "slonik";
import {Entity, EntityKeys, EntityLike} from "../types/index.js";
import {conditionalSql, convertToIdentifiers, manyRows} from "../utils/sql.js";
import {expandFields} from "./utils.js";

export const buildFindAllEntitiesWithPool =
    (pool: CommonQueryMethods) => <
        T extends EntityLike<T>,
        P extends Partial<T>,
        Keys extends EntityKeys<T>,
    >(
        entity: Entity<T, P>,
        orderBy?: Array<{
            field: Keys,
            order: 'asc' | 'desc'
        }>
    ) => {
        const {table, fields} = convertToIdentifiers(entity);

        return async (
            limit?: number,
            offset?: number,
            search?: SearchOptions<T>
        ) => manyRows(
            pool.query(sql.type(entity.guard)`
                select ${expandFields(fields)}
                from ${table} ${buildSearchSql(entity, search)} ${conditionalSql(orderBy, (orderBy) => {
                    const orderBySql = orderBy.map(({order, field}) =>
                            order === 'desc' ? sql.fragment`${fields[field]} desc` : sql.fragment`${fields[field]} asc`
                    )
                    return sql.fragment`order by ${sql.join(orderBySql, sql.fragment`, `)}`
                })} ${conditionalSql(limit, (limit) => sql.fragment`limit ${limit}`)}
                    ${conditionalSql(offset, (offset) => sql.fragment`offset ${offset}`)}
            `)
        )
    }
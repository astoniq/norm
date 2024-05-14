import {CommonQueryMethods, sql} from "slonik";
import {Entity, EntityGuard, EntityKeys, EntityLike} from "../types/index.js";
import {conditionalSql, convertToIdentifiers, manyRows} from "../utils/sql.js";
import {buildSearchSql, expandFields, SearchOptions} from "./utils.js";

export const buildFindAllEntitiesWithPool =
    (pool: CommonQueryMethods) => <
        T extends EntityLike<T>,
        Keys extends EntityKeys<T>,
    >(
        entity: Entity<T>,
        guard: EntityGuard<T>,
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
            pool.query(sql.type(guard)`
                select ${expandFields(entity)}
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
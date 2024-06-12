import {sql, SqlToken} from "slonik";
import {Entity, EntityLike, Table} from "../types/index.js";
import {conditionalSql, convertToIdentifiers} from "../utils/sql.js";

export type SearchOptions<T extends EntityLike<T>> = {
    fields: Array<keyof T>;
    keyword: string
}

export const buildSearchSql = <
    T extends EntityLike<T>,
    P extends Partial<T>,
>(
    entity: Entity<T, P>,
    search?: SearchOptions<T>,
    prefixSql: SqlToken = sql.fragment`where `
) => {
    const {fields} = convertToIdentifiers(entity, true);

    return conditionalSql(search, (search) => {
        const {fields: searchFields, keyword} = search;
        const searchSql = sql.join(
            searchFields.map((field) => sql.fragment`${fields[field]} ilike ${`%${keyword}%`}`),
            sql.fragment` or `
        )

        return sql.fragment`${prefixSql}(${searchSql})`
    })
}

export const expandFields = <T extends EntityLike<T>>(entity: Table<T>, tablePrefix = false
) => {
    const {fields} = convertToIdentifiers(entity, tablePrefix)
    return sql.join(Object.values(fields), sql.fragment`, `)
}
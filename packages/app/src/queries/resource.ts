import {CommonQueryMethods, sql} from "slonik";
import {resourceEntity} from "../entities/index.js";
import {convertToIdentifiers} from "../utils/sql.js";
import {resourceGuard} from "@astoniq/norm-schema";
import {buildInsertIntoWithPool} from "../database/index.js";

const {table, fields} = convertToIdentifiers(resourceEntity);

export const createResourceQueries = (pool: CommonQueryMethods) => {

    const insertResource = buildInsertIntoWithPool(pool)(
        resourceEntity, {returning: true}
    )

    const hasResourceById = async (id: string) =>
        pool.exists(sql.type(resourceGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.id} = ${id}
        `)

    const findResourceById = async (id: string) => {
        return pool.maybeOne(sql.type(resourceGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.id} = ${id}
        `)
    }

    const findResourceByResourceId = async (resourceId: string) => {
        return pool.maybeOne(sql.type(resourceGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.resourceId} = ${resourceId}
        `)
    }

    return {
        insertResource,
        findResourceByResourceId,
        findResourceById,
        hasResourceById
    }
}
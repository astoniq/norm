import {CommonQueryMethods, sql,} from "slonik";
import {resourceEntity} from "../entities/index.js";
import { convertToIdentifiers} from "../utils/sql.js";
import {resourceGuard} from "@astoniq/norm-schema";
import {buildGetTotalRowCountWithPool, buildInsertIntoWithPool, expandFields} from "../database/index.js";

const {table, fields} = convertToIdentifiers(resourceEntity);

export const createResourceQueries = (pool: CommonQueryMethods) => {

    const insertResource = buildInsertIntoWithPool(pool)(
        resourceEntity, {returning: true}
    )

    const getTotalCountResources = buildGetTotalRowCountWithPool(pool, resourceEntity)

    const findTotalCountResources = (tenantId: string) => getTotalCountResources(
        sql.fragment`${fields.tenantId}=${tenantId}`
    )

    const hasResourceById = async (tenantId: string, id: string) =>
        pool.exists(sql.type(resourceGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.tenantId} = ${tenantId}
              and ${fields.id} = ${id}
        `)

    const findResourceById = async (id: string) => {
        return pool.maybeOne(sql.type(resourceGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.id} = ${id}
        `)
    }

    const findResourceByResourceId = async (resourceId: string) => {
        return pool.maybeOne(sql.type(resourceGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.resourceId} = ${resourceId}
        `)
    }

    return {
        insertResource,
        findTotalCountResources,
        findResourceByResourceId,
        findResourceById,
        hasResourceById
    }
}
import {CommonQueryMethods, sql} from "slonik";
import {resourceEntity} from "../entities/index.js";
import {convertToIdentifiers, expandFields} from "../utils/sql.js";
import {resourceGuard} from "@astoniq/norm-schema";
import {
    buildFindAllEntitiesWithPool,
    buildGetTotalRowCountWithPool,
    buildInsertIntoWithPool,
} from "../database/index.js";

const {table, fields} = convertToIdentifiers(resourceEntity);

export const createResourceQueries = (pool: CommonQueryMethods) => {

    const insertResource = buildInsertIntoWithPool(pool, resourceEntity, {
        returning: true
    })

    const getTotalCountResources = buildGetTotalRowCountWithPool(pool, resourceEntity)

    const findAllResources = buildFindAllEntitiesWithPool(pool, resourceEntity)

    const buildProjectConditionSql = (projectId: string) => sql.fragment`${fields.projectId}=${projectId}`

    const findAllProjectResources = (projectId: string, limit?: number, offset?: number) => findAllResources(
        {
            limit: limit,
            offset: offset,
            conditionSql: buildProjectConditionSql(projectId)
        }
    )

    const getTotalCountProjectResources = (projectId: string) => getTotalCountResources(
        buildProjectConditionSql(projectId)
    )

    const hasProjectResourceById = async (projectId: string, id: string) =>
        pool.exists(sql.type(resourceGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `)

    const findProjectResourceById = async (projectId: string, id: string) => {
        return pool.maybeOne(sql.type(resourceGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `)
    }

    const findProjectResourceByResourceId = async (projectId: string, resourceId: string) => {
        return pool.maybeOne(sql.type(resourceGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.resourceId} = ${resourceId}
        `)
    }

    return {
        insertResource,
        findAllProjectResources,
        getTotalCountProjectResources,
        hasProjectResourceById,
        findProjectResourceById,
        findProjectResourceByResourceId
    }
}
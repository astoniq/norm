import {CommonQueryMethods, sql} from "slonik";
import {resourceEntity} from "../entities/index.js";
import {convertToIdentifiers, expandFields, OmitAutoSetFields} from "../utils/sql.js";
import {Resource, resourceGuard} from "@astoniq/norm-schema";
import {
    buildFindAllEntitiesWithPool,
    buildGetTotalRowCountWithPool,
    buildInsertIntoWithPool, buildUpdateWhereWithPool,
} from "../database/index.js";
import {DeletionError} from "../errors/index.js";

const {table, fields} = convertToIdentifiers(resourceEntity);

export const createResourceQueries = (pool: CommonQueryMethods) => {

    const insertResource = buildInsertIntoWithPool(pool, resourceEntity, {
        returning: true
    })

    const updateResource = buildUpdateWhereWithPool(pool, resourceEntity, true)

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

    const deleteProjectResourceById = async (projectId: string, id: string) => {
        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `);

        if (rowCount < 1) {
            throw new DeletionError(resourceEntity.table, id);
        }
    };

    const updateProjectResourceById = async (
        projectId: string,
        id: string,
        set: Partial<OmitAutoSetFields<Resource>>,
        jsonbMode: 'replace' | 'merge' = 'merge'
    ) => updateResource({set, where: {projectId, id}, jsonbMode})

    return {
        insertResource,
        findAllProjectResources,
        deleteProjectResourceById,
        getTotalCountProjectResources,
        updateProjectResourceById,
        hasProjectResourceById,
        findProjectResourceById,
        findProjectResourceByResourceId
    }
}
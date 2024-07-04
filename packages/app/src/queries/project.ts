import {CommonQueryMethods, sql} from "slonik";
import {Project, projectGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers, OmitAutoSetFields} from "../utils/sql.js";
import {projectEntity} from "../entities/index.js";
import {
    buildFindEntitiesWithPool,
    buildGetTotalRowCountWithPool,
    buildInsertIntoWithPool,
    buildUpdateWhereWithPool
} from "../database/index.js";

const {table, fields} = convertToIdentifiers(projectEntity);

export const createProjectQueries = (pool: CommonQueryMethods) => {

    const updateProject = buildUpdateWhereWithPool(pool, projectEntity, true)

    const getTotalCountProjects = buildGetTotalRowCountWithPool(pool, projectEntity)

    const findProjects = buildFindEntitiesWithPool(pool, projectEntity)

    const insertProject = buildInsertIntoWithPool(pool, projectEntity, {
        returning: true
    })

    const findProjectById = async (id: string) =>
        pool.maybeOne(sql.type(projectGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.id} = ${id}
        `);

    const findAllProjects = (limit?: number, offset?: number) => findProjects(
        {
            limit: limit,
            offset: offset,
            orderBy: [
                {field: 'createdAt', order: 'desc'}
            ]
        }
    )

    const findProjectByClientKey = async (clientKey: string) =>
        pool.maybeOne(sql.type(projectGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.clientKey} = ${clientKey}
        `);

    const updateProjectById = async (
        id: string,
        set: Partial<OmitAutoSetFields<Project>>,
        jsonbMode: 'replace' | 'merge' = 'merge'
    ) => updateProject({set, where: {id}, jsonbMode})


    return {
        findProjectById,
        findAllProjects,
        updateProjectById,
        getTotalCountProjects,
        insertProject,
        findProjectByClientKey
    }
}
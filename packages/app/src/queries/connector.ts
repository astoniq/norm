import {CommonQueryMethods, sql} from "slonik";
import {buildFindEntitiesWithPool, buildGetTotalRowCountWithPool, buildInsertIntoWithPool} from "../database/index.js";
import {connectorEntity} from "../entities/index.js";
import {connectorGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(connectorEntity);

export const createConnectorQueries = (pool: CommonQueryMethods) => {

    const insertConnector = buildInsertIntoWithPool(pool, connectorEntity, {
        returning: true
    })

    const getTotalCountConnectors = buildGetTotalRowCountWithPool(pool, connectorEntity)

    const findConnectors = buildFindEntitiesWithPool(pool, connectorEntity)

    const buildProjectConditionSql = (projectId: string) => sql.fragment`${fields.projectId}=${projectId}`

    const getTotalCountProjectConnectors = (projectId: string) => getTotalCountConnectors(
        buildProjectConditionSql(projectId)
    )

    const findAllProjectConnectors = (projectId: string, limit?: number, offset?: number) => findConnectors(
        {
            limit: limit,
            offset: offset,
            conditionSql: buildProjectConditionSql(projectId),
            orderBy: [
                {field: 'createdAt', order: 'desc'}
            ]
        }
    )

    const findProjectConnectorById = async (projectId: string, id: string) =>
        pool.maybeOne(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `);

    const findProjectConnectors = async (projectId: string) =>
        pool.any(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.projectId} = ${projectId}
        `)

    return {
        getTotalCountProjectConnectors,
        findAllProjectConnectors,
        findProjectConnectorById,
        findProjectConnectors,
        insertConnector
    }
}
import {CommonQueryMethods, sql} from "slonik";
import {
    buildFindEntitiesWithPool,
    buildGetTotalRowCountWithPool,
    buildInsertIntoWithPool,
    buildUpdateWhereWithPool
} from "../database/index.js";
import {connectorEntity} from "../entities/index.js";
import {Connector, connectorGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers, OmitAutoSetFields} from "../utils/sql.js";
import {DeletionError} from "../errors/index.js";

const {table, fields} = convertToIdentifiers(connectorEntity);

export const createConnectorQueries = (pool: CommonQueryMethods) => {

    const insertConnector = buildInsertIntoWithPool(pool, connectorEntity, {
        returning: true
    })

    const getTotalCountConnectors = buildGetTotalRowCountWithPool(pool, connectorEntity)

    const findConnectors = buildFindEntitiesWithPool(pool, connectorEntity)

    const updateConnector = buildUpdateWhereWithPool(pool, connectorEntity, true)

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
        pool.one(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `);

    const findProjectConnectorsEnabled = async (projectId: string) =>
        pool.any(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.enabled} = true
        `)

    const updateProjectConnectorById = async (
        projectId: string,
        id: string,
        set: Partial<OmitAutoSetFields<Connector>>,
        jsonbMode: 'replace' | 'merge' = 'merge'
    ) => updateConnector({set, where: {projectId, id}, jsonbMode})

    const deleteProjectConnectorById = async (projectId: string, id: string) => {
        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `);

        if (rowCount < 1) {
            throw new DeletionError(connectorEntity.table, id);
        }
    };

    return {
        getTotalCountProjectConnectors,
        deleteProjectConnectorById,
        updateProjectConnectorById,
        findAllProjectConnectors,
        findProjectConnectorById,
        findProjectConnectorsEnabled,
        insertConnector
    }
}
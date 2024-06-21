import {CommonQueryMethods, sql} from "slonik";
import {buildInsertIntoWithPool} from "../database/index.js";
import {connectorEntity} from "../entities/index.js";
import {connectorGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";
import {ConnectorType} from "@astoniq/norm-shared";

const {table, fields} = convertToIdentifiers(connectorEntity);

export const createConnectorQueries = (pool: CommonQueryMethods) => {

    const insertConnector = buildInsertIntoWithPool(pool, connectorEntity, {
        returning: true
    })

    const findProjectConnectorById = async (projectId: string, id: string) =>
        pool.maybeOne(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `);

    const findProjectConnectorsByType = async (projectId: string, type: ConnectorType) =>
        pool.any(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.type} = ${type}
        `)

    return {
        findProjectConnectorById,
        findProjectConnectorsByType,
        insertConnector
    }
}
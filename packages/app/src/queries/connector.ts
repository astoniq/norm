import {CommonQueryMethods, sql} from "slonik";
import {buildInsertIntoWithPool} from "../database/index.js";
import {connectorEntity} from "../entities/index.js";
import {connectorGuard, ConnectorType} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(connectorEntity);

export const createConnectorQueries = (pool: CommonQueryMethods) => {

    const insertConnector = buildInsertIntoWithPool(pool)(connectorEntity, connectorGuard, {
        returning: true
    })

    const findConnectorById = async (id: string) =>
        pool.maybeOne(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.id} = ${id}
        `);

    const findConnectorsByType = async (type: ConnectorType) =>
        pool.any(sql.type(connectorGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.type} = ${type}
        `)

    return {
        findConnectorsByType,
        findConnectorById,
        insertConnector
    }
}
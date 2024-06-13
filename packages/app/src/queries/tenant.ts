import {CommonQueryMethods, sql} from "slonik";
import {tenantGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";
import {tenantEntity} from "../entities/index.js";

const {table, fields} = convertToIdentifiers(tenantEntity);

export const createTenantQueries = (pool: CommonQueryMethods) => {

    const findTenantById = async (id: string) =>
        pool.maybeOne(sql.type(tenantGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.id} = ${id}
        `);

    const findTenantByClientKey = async (clientKey: string) =>
        pool.maybeOne(sql.type(tenantGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.clientKey} = ${clientKey}
        `);

    return {
        findTenantById,
        findTenantByClientKey
    }
}
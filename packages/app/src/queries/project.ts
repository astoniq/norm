import {CommonQueryMethods, sql} from "slonik";
import {projectGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";
import {projectEntity} from "../entities/index.js";

const {table, fields} = convertToIdentifiers(projectEntity);

export const createProjectQueries = (pool: CommonQueryMethods) => {

    const findProjectById = async (id: string) =>
        pool.maybeOne(sql.type(projectGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.id} = ${id}
        `);

    const findProjectByClientKey = async (clientKey: string) =>
        pool.maybeOne(sql.type(projectGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.clientKey} = ${clientKey}
        `);

    return {
        findProjectById,
        findProjectByClientKey
    }
}
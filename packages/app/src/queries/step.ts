import {CommonQueryMethods, sql} from "slonik";
import {stepEntity} from "../entities/index.js";
import {convertToIdentifiers} from "../utils/sql.js";
import {stepGuard} from "@astoniq/norm-schema";
import {buildInsertIntoWithPool, buildUpdateWhereWithPool} from "../database/index.js";
import {JsonObject} from "@astoniq/norm-shared";

const {table, fields} = convertToIdentifiers(stepEntity);

export const createStepQueries = (pool: CommonQueryMethods) => {

    const insertStep = buildInsertIntoWithPool(pool, stepEntity, {
        returning: true
    })

    const updateStep = buildUpdateWhereWithPool(pool, stepEntity, true)

    const findAllProjectStepByNotificationId = async (projectId: string, notificationId: string) =>
        pool.any(sql.type(stepGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.notificationId} = ${notificationId}
        `)

    const updateProjectStepStatusById = async (
        projectId: string,
        id: string,
        status: string
    ) => updateStep({
        set: {status}, where: {id, projectId}, jsonbMode: 'replace'
    });

    const updateProjectStepResultById = async (
        projectId: string,
        id: string,
        status: string,
        result: JsonObject
    ) => updateStep({
        set: {status, result}, where: {id, projectId}, jsonbMode: 'replace'
    });

    const findProjectStepById = async (projectId: string, id: string) =>
        pool.maybeOne(sql.type(stepGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `)

    return {
        findAllProjectStepByNotificationId,
        updateProjectStepStatusById,
        updateProjectStepResultById,
        findProjectStepById,
        insertStep
    }
}
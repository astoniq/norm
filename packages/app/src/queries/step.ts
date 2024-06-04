import {CommonQueryMethods, sql} from "slonik";
import {stepEntity} from "../entities/index.js";
import {convertToIdentifiers} from "../utils/sql.js";
import {stepGuard} from "@astoniq/norm-schema";
import {buildInsertIntoWithPool, buildUpdateWhereWithPool} from "../database/index.js";
import {JsonObject} from "@astoniq/norm-shared";

const {table, fields} = convertToIdentifiers(stepEntity);

export const createStepQueries = (pool: CommonQueryMethods) => {

    const findAllStepByNotificationId = async (notificationId: string) =>
        pool.any(sql.type(stepGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.notificationId} = ${notificationId}
        `)

    const insertStep = buildInsertIntoWithPool(pool)(
        stepEntity, stepGuard, {returning: true}
    )

    const updateStep = buildUpdateWhereWithPool(pool)(
        stepEntity, stepGuard, true)

    const updateStepStatusById = async (
        id: string,
        status: string
    ) => updateStep({
        set: {status}, where: {id}, jsonbMode: 'replace'
    });

    const updateStepResultById = async (
        id: string,
        status: string,
        result: JsonObject
    ) => updateStep({
        set: {status, result}, where: {id}, jsonbMode: 'replace'
    });

    const findStepById = async (id: string) =>
        pool.maybeOne(sql.type(stepGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.id} = ${id}
        `)

    return {
        findAllStepByNotificationId,
        updateStepResultById,
        updateStepStatusById,
        findStepById,
        insertStep
    }
}
import {CommonQueryMethods, sql} from "slonik";
import {stepEntity} from "../entities/index.js";
import {convertToIdentifiers} from "../utils/sql.js";
import {stepGuard} from "@astoniq/norm-schema";

const {table, fields} = convertToIdentifiers(stepEntity);

export const createStepQueries = (pool: CommonQueryMethods) => {

    const findAllStepByNotificationId = async (notificationId: string) =>
        pool.any(sql.type(stepGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.notificationId} = ${notificationId}
        `)

    return {
        findAllStepByNotificationId
    }
}
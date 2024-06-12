import {CommonQueryMethods, sql} from "slonik";
import {notificationEntity} from "../entities/index.js";
import {buildInsertIntoWithPool, buildUpdateWhereWithPool} from "../database/index.js";
import {notificationGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(notificationEntity);

export const createNotificationQueries = (pool: CommonQueryMethods) => {

    const insertNotification = buildInsertIntoWithPool(pool)(
        notificationEntity, {returning: true}
    )

    const findNotificationById = async (id: string) =>
        pool.maybeOne(sql.type(notificationGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.id} = ${id}
        `)

    const updateNotification = buildUpdateWhereWithPool(pool)(
        notificationEntity, true
    )

    const updateNotificationStatusById = async (
        id: string,
        status: string
    ) => updateNotification({
        set: {status}, where: {id}, jsonbMode: 'replace'
    });

    return {
        updateNotificationStatusById,
        updateNotification,
        findNotificationById,
        insertNotification
    }
}
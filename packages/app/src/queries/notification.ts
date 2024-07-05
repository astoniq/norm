import {CommonQueryMethods, sql} from "slonik";
import {notificationEntity} from "../entities/index.js";
import {
    buildFindEntitiesWithPool,
    buildGetTotalRowCountWithPool,
    buildInsertIntoWithPool,
    buildUpdateWhereWithPool
} from "../database/index.js";
import {notificationGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(notificationEntity);

export const createNotificationQueries = (pool: CommonQueryMethods) => {

    const insertNotification = buildInsertIntoWithPool(pool, notificationEntity, {
        returning: true
    })

    const findNotifications = buildFindEntitiesWithPool(pool, notificationEntity)

    const getTotalCountNotifications = buildGetTotalRowCountWithPool(pool, notificationEntity)

    const buildProjectConditionSql = (projectId: string) => sql.fragment`${fields.projectId}=${projectId}`

    const findProjectNotificationById = async (projectId: string, id: string) =>
        pool.maybeOne(sql.type(notificationGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `)

    const getTotalCountProjectNotifications = (projectId: string) => getTotalCountNotifications(
        buildProjectConditionSql(projectId)
    )

    const findAllProjectNotifications = (projectId: string, limit?: number, offset?: number) => findNotifications(
        {
            limit: limit,
            offset: offset,
            conditionSql: buildProjectConditionSql(projectId),
            orderBy: [
                {field: 'createdAt', order: 'desc'}
            ]
        }
    )

    const updateNotification = buildUpdateWhereWithPool(pool, notificationEntity, true)

    const updateProjectNotificationStatusById = async (
        projectId: string,
        id: string,
        status: string
    ) => updateNotification({
        set: {status}, where: {id, projectId}, jsonbMode: 'replace'
    });

    return {
        findProjectNotificationById,
        getTotalCountProjectNotifications,
        findAllProjectNotifications,
        updateNotification,
        updateProjectNotificationStatusById,
        insertNotification
    }
}
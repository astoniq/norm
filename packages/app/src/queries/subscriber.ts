import {CommonQueryMethods, sql} from "slonik";
import {buildFindAllEntitiesWithPool, buildInsertIntoWithPool, buildUpdateWhereWithPool} from "../database/index.js";
import {subscriberEntity} from "../entities/index.js";
import {subscriberGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(subscriberEntity);

export const createSubscriberQueries = (pool: CommonQueryMethods) => {

    const findAllSubscribers = buildFindAllEntitiesWithPool(pool, subscriberEntity)

    const insertSubscriber = buildInsertIntoWithPool(pool, subscriberEntity, {
        returning: true
    })

    const buildProjectConditionSql = (projectId: string) => sql.fragment`${fields.projectId}=${projectId}`

    const updateSubscriber = buildUpdateWhereWithPool(pool, subscriberEntity, true)

    const findAllProjectSubscribers = (projectId: string, limit?: number, offset?: number) => findAllSubscribers(
        {
            limit: limit,
            offset: offset,
            conditionSql: buildProjectConditionSql(projectId)
        }
    )

    const hasProjectSubscriberBySubscriberId = async (projectId: string, subscriberId: string) => {
        return pool.exists(sql.type(subscriberGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.subscriberId} = ${subscriberId}
              and ${fields.projectId} = ${projectId}
        `)
    }

    const findProjectSubscriberBySubscriberIds = async (projectId: string, ids: string[]) => {
        return ids.length > 0
            ? pool.any(sql.type(subscriberGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.subscriberId} in (${sql.join(ids, sql.fragment`, `)})
                      and ${fields.projectId} = ${projectId}
            `)
            : [];
    }

    const findProjectSubscriberById = async (projectId: string, id: string) => {
        return pool.maybeOne(sql.type(subscriberGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.id} = ${id}
              and ${fields.projectId} = ${projectId}
        `)
    }

    return {
        hasProjectSubscriberBySubscriberId,
        findProjectSubscriberBySubscriberIds,
        findProjectSubscriberById,
        updateSubscriber,
        insertSubscriber,
        findAllSubscribers,
        findAllProjectSubscribers
    }
}
import {CommonQueryMethods, sql} from "slonik";
import {
    buildFindEntitiesWithPool,
    buildGetTotalRowCountWithPool,
    buildInsertIntoWithPool,
    buildUpdateWhereWithPool
} from "../database/index.js";
import {subscriberEntity} from "../entities/index.js";
import {subscriberGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers, expandFields} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(subscriberEntity);

export const createSubscriberQueries = (pool: CommonQueryMethods) => {

    const findSubscribers = buildFindEntitiesWithPool(pool, subscriberEntity)

    const insertSubscriber = buildInsertIntoWithPool(pool, subscriberEntity, {
        returning: true
    })

    const getTotalCountSubscribers = buildGetTotalRowCountWithPool(pool, subscriberEntity)


    const buildProjectConditionSql = (projectId: string) => sql.fragment`${fields.projectId}=${projectId}`

    const updateSubscriber = buildUpdateWhereWithPool(pool, subscriberEntity, true)


    const getTotalCountProjectSubscribers = (projectId: string) => getTotalCountSubscribers(
        buildProjectConditionSql(projectId)
    )

    const findAllProjectSubscribers = (projectId: string, limit?: number, offset?: number) => findSubscribers(
        {
            limit: limit,
            offset: offset,
            conditionSql: buildProjectConditionSql(projectId),
            orderBy: [
                {field: 'createdAt', order: 'desc'}
            ]
        }
    )

    const hasProjectSubscriberBySubscriberId = async (projectId: string, subscriberId: string) => {
        return pool.exists(sql.type(subscriberGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.subscriberId} = ${subscriberId}
              and ${fields.projectId} = ${projectId}
        `)
    }

    const findProjectSubscriberBySubscriberId = async (projectId: string, subscriberId: string) => {
        return pool.one(sql.type(subscriberGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.subscriberId} = ${subscriberId}
              and ${fields.projectId} = ${projectId}
        `)
    }

    const findProjectSubscribersBySubscriberIds = async (projectId: string, ids: string[]) => {
        return ids.length > 0
            ? pool.any(sql.type(subscriberGuard)`
                    select ${expandFields(fields)}
                    from ${table}
                    where ${fields.subscriberId} in (${sql.join(ids, sql.fragment`, `)})
                      and ${fields.projectId} = ${projectId}
            `)
            : [];
    }

    const findProjectSubscriberById = async (projectId: string, id: string) => {
        return pool.maybeOne(sql.type(subscriberGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.id} = ${id}
              and ${fields.projectId} = ${projectId}
        `)
    }

    return {
        hasProjectSubscriberBySubscriberId,
        findProjectSubscribersBySubscriberIds,
        findProjectSubscriberById,
        getTotalCountProjectSubscribers,
        findProjectSubscriberBySubscriberId,
        updateSubscriber,
        insertSubscriber,
        findSubscribers,
        findAllProjectSubscribers
    }
}
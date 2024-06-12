import {CommonQueryMethods, sql} from "slonik";
import {buildFindAllEntitiesWithPool, buildInsertIntoWithPool, buildUpdateWhereWithPool} from "../database/index.js";
import {subscriberEntity} from "../entities/index.js";
import {subscriberGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(subscriberEntity);

export const createSubscriberQueries = (pool: CommonQueryMethods) => {

    const findAllSubscribers = buildFindAllEntitiesWithPool(pool)(
        subscriberEntity,
    )

    const insertSubscriber = buildInsertIntoWithPool(pool)(
        subscriberEntity, {returning: true}
    )

    const updateSubscriber = buildUpdateWhereWithPool(pool)(
        subscriberEntity, true
    )

    const hasSubscriberBySubscriberId = async (tenantId: string, subscriberId: string) => {
        return pool.exists(sql.type(subscriberGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.subscriberId} = ${subscriberId}
              and ${fields.tenantId} = ${tenantId}
        `)
    }

    const findSubscriberBySubscriberIds = async (ids: string[]) => {
        return ids.length > 0
            ? pool.any(sql.type(subscriberGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.subscriberId} in (${sql.join(ids, sql.fragment`, `)})
            `)
            : [];
    }

    const findSubscriberById = async (id: string) => {
        return pool.maybeOne(sql.type(subscriberGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.id} = ${id}
        `)
    }

    return {
        findSubscriberBySubscriberIds,
        hasSubscriberBySubscriberId,
        findSubscriberById,
        updateSubscriber,
        insertSubscriber,
        findAllSubscribers
    }
}
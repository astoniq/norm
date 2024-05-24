import {CommonQueryMethods, sql} from "slonik";
import {buildFindAllEntitiesWithPool, buildInsertIntoWithPool, buildUpdateWhereWithPool} from "../database/index.js";
import {subscriberEntity} from "../entities/index.js";
import {subscriberGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(subscriberEntity);

export const createSubscriberQueries = (pool: CommonQueryMethods) => {

    const findAllSubscribers = buildFindAllEntitiesWithPool(pool)(
        subscriberEntity, subscriberGuard
    )

    const insertSubscriber = buildInsertIntoWithPool(pool)(
        subscriberEntity, subscriberGuard, {returning: true}
    )

    const updateSubscriber = buildUpdateWhereWithPool(pool)(
        subscriberEntity, subscriberGuard, true
    )

    const hasSubscriberByExternalId = async (externalId: string) => {
        return pool.exists(sql.type(subscriberGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.externalId} = ${externalId}
        `)
    }

    return {
        hasSubscriberByExternalId,
        updateSubscriber,
        insertSubscriber,
        findAllSubscribers
    }
}
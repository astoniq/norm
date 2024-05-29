import {CommonQueryMethods, sql} from "slonik";
import {buildFindAllEntitiesWithPool, buildInsertIntoWithPool} from "../database/index.js";
import {subscriberReferenceEntity} from "../entities/index.js";
import {ConnectorType, subscriberReferenceGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(subscriberReferenceEntity);

export const createSubscriberReferenceQueries = (pool: CommonQueryMethods) => {

    const findAllSubscriberReferences = buildFindAllEntitiesWithPool(pool)(
        subscriberReferenceEntity, subscriberReferenceGuard
    )

    const insertSubscriberReference = buildInsertIntoWithPool(pool)(
        subscriberReferenceEntity, subscriberReferenceGuard, {returning: true}
    )

    const findSubscriberReferencesByType = async (subscriberId: string, type: ConnectorType) => {
        return pool.any(sql.type(subscriberReferenceGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.subscriberId} = ${subscriberId}
              and ${fields.type} = ${type}
        `)
    }

    return {
        findAllSubscriberReferences,
        insertSubscriberReference,
        findSubscriberReferencesByType
    }
}
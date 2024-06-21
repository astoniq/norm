import {CommonQueryMethods, sql} from "slonik";
import {buildFindAllEntitiesWithPool, buildInsertIntoWithPool} from "../database/index.js";
import {subscriberReferenceEntity} from "../entities/index.js";
import {subscriberReferenceGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(subscriberReferenceEntity);

export const createSubscriberReferenceQueries = (pool: CommonQueryMethods) => {

    const findAllSubscriberReferences = buildFindAllEntitiesWithPool(pool, subscriberReferenceEntity)

    const insertSubscriberReference = buildInsertIntoWithPool(pool, subscriberReferenceEntity, {
        returning: true
    })

    const upsertSubscriberReference = buildInsertIntoWithPool(pool, subscriberReferenceEntity, {
        onConflict: {
            fields: [fields.projectId, fields.subscriberId, fields.target],
            setExcludedFields: [fields.credentials]
        }
    })

    const findProjectSubscriberReferencesBySubscriberId = async (projectId: string, subscriberId: string) => {
        return pool.any(sql.type(subscriberReferenceGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.subscriberId} = ${subscriberId}
              and ${fields.projectId} = ${projectId}
        `)
    }

    return {
        upsertSubscriberReference,
        findAllSubscriberReferences,
        insertSubscriberReference,
        findProjectSubscriberReferencesBySubscriberId
    }
}
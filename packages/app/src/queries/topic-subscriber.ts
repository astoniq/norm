import {CommonQueryMethods, sql} from "slonik";
import {buildInsertIntoWithPool} from "../database/index.js";
import {conditionalArraySql, convertToIdentifiers} from "../utils/sql.js";
import {topicSubscriberEntity} from "../entities/index.js";
import {topicSubscriberGuard} from "@astoniq/norm-schema";

const {table, fields} = convertToIdentifiers(topicSubscriberEntity);

export const createTopicSubscriberQueries = (pool: CommonQueryMethods) => {

    const insertTopicSubscriber = buildInsertIntoWithPool(pool)(
        topicSubscriberEntity, topicSubscriberGuard, {
            returning: true
        })

    const findTopicSubscribersByIds = async (topicsIds: string[], excludeExternalIds: string[]) => {
        return topicsIds.length > 0
            ? pool.any(sql.type(topicSubscriberGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.topicId} in (${sql.join(topicsIds, sql.fragment`, `)})
                        ${conditionalArraySql(excludeExternalIds, value =>
                                sql.fragment`and ${fields.externalId} not in (${sql.join(value, sql.fragment`, `)})`)}
            `)
            : [];
    }

    return {
        findTopicSubscribersByIds,
        insertTopicSubscriber
    }
}
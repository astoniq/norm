import {CommonQueryMethods, sql} from "slonik";
import {buildInsertIntoWithPool} from "../database/index.js";
import {conditionalArraySql, convertToIdentifiers} from "../utils/sql.js";
import {topicSubscriberEntity} from "../entities/index.js";
import {topicSubscriberGuard} from "@astoniq/norm-schema";

const {table, fields} = convertToIdentifiers(topicSubscriberEntity);

export const createTopicSubscriberQueries = (pool: CommonQueryMethods) => {

    const insertTopicSubscriber = buildInsertIntoWithPool(pool,
        topicSubscriberEntity, {
            returning: true
        })

    const findProjectTopicSubscribersByTopicIds = async (
        projectId: string, topicsIds: string[], excludeSubscriberIds: string[]) => {
        return topicsIds.length > 0
            ? pool.any(sql.type(topicSubscriberGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.projectId} = ${projectId}
                      and ${fields.topicId} in (${sql.join(topicsIds, sql.fragment`, `)})
                        ${conditionalArraySql(excludeSubscriberIds, value =>
                                sql.fragment`and ${fields.subscriberId} not in (${sql.join(value, sql.fragment`, `)})`)}
            `)
            : [];
    }

    return {
        findProjectTopicSubscribersByTopicIds,
        insertTopicSubscriber
    }
}
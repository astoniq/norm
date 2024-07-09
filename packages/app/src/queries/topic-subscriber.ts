import {CommonQueryMethods, sql} from "slonik";
import {buildInsertIntoWithPool} from "../database/index.js";
import {conditionalArraySql, convertToIdentifiers, expandFields} from "../utils/sql.js";
import {topicSubscriberEntity} from "../entities/index.js";
import {InsertTopicSubscriber, insertTopicSubscriberGuard, topicSubscriberGuard} from "@astoniq/norm-schema";
import {zodKeys} from "../utils/zod.js";
import {DeletionError} from "../errors/index.js";

const {table, fields} = convertToIdentifiers(topicSubscriberEntity);

export const createTopicSubscriberQueries = (pool: CommonQueryMethods) => {

    const insertTopicSubscriber = buildInsertIntoWithPool(pool,
        topicSubscriberEntity, {
            returning: true
        })

    const findFirstProjectTopicSubscriberBySubscriberIds = async (
        projectId: string, topicId: string, subscribersIds: string[]
    ) => {
        return subscribersIds.length > 0
            ? pool.maybeOne(sql.type(topicSubscriberGuard)`
                    select ${expandFields(fields)}
                    from ${table}
                    where ${fields.projectId} = ${projectId}
                      and ${fields.topicId} = ${topicId}
                      and ${fields.subscriberId} in (${sql.join(subscribersIds, sql.fragment`, `)})
                    limit 1
            `)
            : null
    }

    const findProjectTopicSubscriberBySubscriberId = async (
        projectId: string, topicId: string, subscribersId: string
    ) => {
        return pool.one(sql.type(topicSubscriberGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.topicId} = ${topicId}
              and ${fields.subscriberId} = ${subscribersId}
        `)
    }

    const findProjectTopicSubscribersByTopicIds = async (
        projectId: string, topicsIds: string[], excludeSubscriberIds: string[]) => {
        return topicsIds.length > 0
            ? pool.any(sql.type(topicSubscriberGuard)`
                    select ${expandFields(fields)}
                    from ${table}
                    where ${fields.projectId} = ${projectId}
                      and ${fields.topicId} in (${sql.join(topicsIds, sql.fragment`, `)})
                        ${conditionalArraySql(excludeSubscriberIds, value =>
                                sql.fragment`and ${fields.subscriberId} not in (${sql.join(value, sql.fragment`, `)})`)}
            `)
            : [];
    }

    const insertProjectTopicSubscribers = async (pool: CommonQueryMethods, topicSubscriber: InsertTopicSubscriber) => {
        const insertingKeys = zodKeys(insertTopicSubscriberGuard)
        return pool.query(sql.unsafe`
            insert into ${table} (${sql.join(
                    insertingKeys.options.map((key) => fields[key]), sql.fragment`, `)})
            values (${sql.join(insertingKeys.options.map((key) => topicSubscriber[key]), sql.fragment`, `)})
            on conflict do nothing
        `)
    }

    const deleteProjectTopicSubscriberBySubscriberId = async (
        pool: CommonQueryMethods, projectId: string, topicId: string, subscriberId: string) => {

        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.topicId} = ${topicId}
              and ${fields.subscriberId} = ${subscriberId}
        `);

        if (rowCount < 1) {
            throw new DeletionError(topicSubscriberEntity.table, subscriberId);
        }
    };

    return {
        findProjectTopicSubscribersByTopicIds,
        insertProjectTopicSubscribers,
        findFirstProjectTopicSubscriberBySubscriberIds,
        findProjectTopicSubscriberBySubscriberId,
        deleteProjectTopicSubscriberBySubscriberId,
        insertTopicSubscriber
    }
}
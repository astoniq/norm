import {CommonQueryMethods, sql} from "slonik";
import {buildInsertIntoWithPool} from "../database/index.js";
import {topicEntity} from "../entities/index.js";
import {topicGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers} from "../utils/sql.js";

const {table, fields} = convertToIdentifiers(topicEntity);

export const createTopicQueries = (pool: CommonQueryMethods) => {

    const insertTopic = buildInsertIntoWithPool(pool)(topicEntity, topicGuard, {
        returning: true
    })

    const findTopicsByTopicIds = async (ids: string[]) => {
        return ids.length > 0
            ? pool.any(sql.type(topicGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.topicId} in (${sql.join(ids, sql.fragment`, `)})
            `)
            : [];
    }

    return {
        findTopicsByTopicIds,
        insertTopic
    }
}
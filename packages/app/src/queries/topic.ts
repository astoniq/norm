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

    const findTopicsByNames = async (names: string[]) => {
        return names.length > 0
            ? pool.any(sql.type(topicGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.id} in (${sql.join(names, sql.fragment`, `)})
            `)
            : [];
    }

    return {
        findTopicsByNames,
        insertTopic
    }
}
import {CommonQueryMethods, sql} from "slonik";
import {
    buildFindEntitiesWithPool,
    buildGetTotalRowCountWithPool,
    buildInsertIntoWithPool, buildUpdateWhereWithPool
} from "../database/index.js";
import {topicEntity} from "../entities/index.js";
import {Topic, topicGuard} from "@astoniq/norm-schema";
import {convertToIdentifiers, expandFields, OmitAutoSetFields} from "../utils/sql.js";
import {DeletionError} from "../errors/index.js";

const {table, fields} = convertToIdentifiers(topicEntity);

export const createTopicQueries = (pool: CommonQueryMethods) => {

    const insertTopic = buildInsertIntoWithPool(pool, topicEntity, {
        returning: true
    })

    const getTotalCountTopics = buildGetTotalRowCountWithPool(pool, topicEntity)

    const findTopics = buildFindEntitiesWithPool(pool, topicEntity)

    const updateTopic = buildUpdateWhereWithPool(pool, topicEntity, true)

    const buildProjectConditionSql = (projectId: string) => sql.fragment`${fields.projectId}=${projectId}`

    const getTotalCountProjectTopics = (projectId: string) => getTotalCountTopics(
        buildProjectConditionSql(projectId)
    )

    const findAllProjectTopics = (projectId: string, limit?: number, offset?: number) => findTopics(
        {
            limit: limit,
            offset: offset,
            conditionSql: buildProjectConditionSql(projectId),
            orderBy: [
                {field: 'createdAt', order: 'desc'}
            ]
        }
    )

    const findProjectTopicById = async (projectId: string, id: string) => {
        return pool.one(sql.type(topicGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `)
    }

    const findProjectTopicByTopicId = async (projectId: string, topicId: string) => {
        return pool.one(sql.type(topicGuard)`
            select ${expandFields(fields)}
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.topicId} = ${topicId}
        `)
    }

    const findProjectTopicsByTopicIds = async (projectId: string, ids: string[]) => {
        return ids.length > 0
            ? pool.any(sql.type(topicGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.topicId} in (${sql.join(ids, sql.fragment`, `)})
                      and ${fields.projectId} = ${projectId}
            `)
            : [];
    }

    const updateProjectTopicById = async (
        projectId: string,
        id: string,
        set: Partial<OmitAutoSetFields<Topic>>,
        jsonbMode: 'replace' | 'merge' = 'merge'
    ) => updateTopic({set, where: {projectId, id}, jsonbMode})

    const deleteProjectTopicById = async (projectId: string, id: string) => {
        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.id} = ${id}
        `);

        if (rowCount < 1) {
            throw new DeletionError(topicEntity.table, id);
        }
    };

    const deleteProjectTopicByTopicId = async (projectId: string, topicId: string) => {
        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.projectId} = ${projectId}
              and ${fields.topicId} = ${topicId}
        `);

        if (rowCount < 1) {
            throw new DeletionError(topicEntity.table, topicId);
        }
    };

    return {
        findProjectTopicById,
        findProjectTopicByTopicId,
        findProjectTopicsByTopicIds,
        getTotalCountProjectTopics,
        findAllProjectTopics,
        updateProjectTopicById,
        deleteProjectTopicById,
        deleteProjectTopicByTopicId,
        insertTopic
    }
}
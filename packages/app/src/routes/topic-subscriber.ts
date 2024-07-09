import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createTopicSubscribersGuard,
    paginationGuard,
    topicPaginationResponseGuard,
    topicResponseGuard
} from "@astoniq/norm-schema";
import {object, string, z} from "zod";
import {generateStandardId} from "@astoniq/norm-shared";
import {RequestError} from "../errors/index.js";

export default function topicSubscriberRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        pool,
        topics: {
            getTotalCountProjectTopics,
            findProjectTopicById,
            findAllProjectTopics,
            deleteProjectTopicById,
        },
        topicSubscribers: {
            findFirstProjectTopicSubscriberBySubscriberIds,
            insertProjectTopicSubscribers
        },
        subscribers: {
            findProjectSubscriberBySubscriberId
        }
    } = queries

    router.post(
        '/topics/:id/subscribers',
        koaGuard({
            params: z.object({id: z.string()}),
            body: createTopicSubscribersGuard,
            status: [201, 404, 422]
        }),
        async (ctx, next) => {

            const {
                project: {
                    id: projectId
                },
                guard: {
                    params: {id},
                    body: {
                        subscriberIds
                    }
                }
            } = ctx;

            await findProjectTopicById(projectId, id);

            const existingRecord = await findFirstProjectTopicSubscriberBySubscriberIds(
                projectId,
                id,
                subscriberIds
            );

            if (existingRecord) {
                throw new RequestError({
                        code: 'topic.subscriber_exists',
                        status: 422,
                        subscriberId: existingRecord.subscriberId
                    }
                )
            }

            await Promise.all(
                subscriberIds.map(async (subscriberId) =>
                    findProjectSubscriberBySubscriberId(projectId, subscriberId))
            )

            await pool.transaction(async (transaction) => {
                await Promise.all(
                    subscriberIds.map(async (subscriberId) =>
                        insertProjectTopicSubscribers(transaction, {
                            id: generateStandardId(),
                            projectId,
                            topicId: id,
                            subscriberId
                        }))
                )
            })

            ctx.status = 201;

            return next()
        }
    )

    router.get(
        '/topics/:id/subscribers',
        koaGuard({
            response: topicPaginationResponseGuard,
            query: paginationGuard,
            status: [200, 400]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    query: {
                        pageSize,
                        offset,
                        page
                    }
                }
            } = ctx

            const [totalCount, items] = await Promise.all([
                getTotalCountProjectTopics(project.id),
                findAllProjectTopics(project.id, pageSize, offset)
            ])

            ctx.body = {
                page,
                pageSize,
                totalCount,
                items
            }

            return next()
        }
    )

    router.get(
        '/topics/:id/subscribers/:subscriberId',
        koaGuard({
            params: object({id: string().min(1)}),
            response: topicResponseGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {


            const {
                project,
                guard: {
                    params: {
                        id
                    }
                }
            } = ctx

            ctx.body = await findProjectTopicById(project.id, id)

            return next();
        }
    )

    router.delete(
        '/topics/:id/subscribers/:subscriberId',
        koaGuard({
            params: z.object({id: z.string()}),
            status: [204, 404]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    params: {
                        id
                    }
                }
            } = ctx

            await deleteProjectTopicById(project.id, id)

            ctx.status = 204;

            return next();
        }
    )
}
import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createTopicGuard,
    paginationGuard,
    patchTopicGuard,
    topicPaginationResponseGuard,
    topicResponseGuard
} from "@astoniq/norm-schema";
import {object, string, z} from "zod";
import {generateStandardId} from "@astoniq/norm-shared";

export default function topicRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        topics: {
            insertTopic,
            getTotalCountProjectTopics,
            findProjectTopicById,
            findAllProjectTopics,
            deleteProjectTopicById,
            updateProjectTopicById,
        }
    } = queries

    router.post(
        '/topics',
        koaGuard({
            body: createTopicGuard,
            response: topicResponseGuard,
            status: [201, 400]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    body: {
                        topicId
                    }
                }
            } = ctx;

            ctx.body = await insertTopic({
                id: generateStandardId(),
                projectId: project.id,
                topicId
            })

            ctx.status = 201;

            return next()
        }
    )

    router.get(
        '/topics',
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
        '/topics/:id',
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

    router.patch(
        '/topics/:id',
        koaGuard({
            params: z.object({id: z.string()}),
            body: patchTopicGuard,
            response: topicResponseGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    body,
                    params: {
                        id
                    }
                }
            } = ctx

            ctx.body = await updateProjectTopicById(project.id, id, body)

            return next();
        }
    )

    router.delete(
        '/topics/:id',
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
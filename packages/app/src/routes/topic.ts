import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    paginationGuard,
    topicGuard,
    topicPaginationResponseGuard
} from "@astoniq/norm-schema";
import {object, string} from "zod";

export default function topicRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        topics: {
            getTotalCountProjectTopics,
            findAllProjectTopics,
        }
    } = queries

    router.post(
        '/topics',
        async (_ctx, next) => {

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
            response: topicGuard,
            status: [200, 404]
        }),
        async (_ctx, next) => {

            return next()
        }
    )

    router.delete(
        '/topics/:id',
        koaGuard({
            params: object({id: string().min(1)}),
            status: [204, 404]
        }),
        async (_ctx, next) => {

            return next();
        }
    )
}
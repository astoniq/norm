import { RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {paginationGuard, subscriberPaginationResponseGuard} from "@astoniq/norm-schema";

export default function subscriberRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        subscribers: {
            getTotalCountProjectSubscribers,
            findAllProjectSubscribers,
        }
    } = queries

    router.get(
        '/subscribers',
        koaGuard({
            response: subscriberPaginationResponseGuard,
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
                getTotalCountProjectSubscribers(project.id),
                findAllProjectSubscribers(project.id, pageSize, offset)
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

    router.post(
        '/subscribers',
        async (_ctx, next) => {

            return next();
        }
    )

    router.post(
        '/subscribers/bulk',
        async (_ctx, next) => {

            return next();
        }
    )

    router.put(
        '/subscribers/:id',
        async (_ctx, next) => {

            return next();
        }
    )

    router.delete(
        '/subscribers/:id',
        async (_ctx, next) => {

            return next();
        }
    )
}
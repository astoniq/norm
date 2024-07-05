import { RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    notificationPaginationResponseGuard,
    paginationGuard,
} from "@astoniq/norm-schema";

export default function notificationRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        notifications: {
            getTotalCountProjectNotifications,
            findAllProjectNotifications,
        }
    } = queries

    router.get(
        '/notifications',
        koaGuard({
            response: notificationPaginationResponseGuard,
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
                getTotalCountProjectNotifications(project.id),
                findAllProjectNotifications(project.id, pageSize, offset)
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
}
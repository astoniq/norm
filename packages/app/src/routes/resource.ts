import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createResourceGuard,
    paginationGuard,
    resourceGuard,
    resourcePaginationResponseGuard,
} from "@astoniq/norm-schema";
import {generateStandardId, generateStandardSecret} from "@astoniq/norm-shared";

export default function resourceRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        resources: {
            insertResource,
            getTotalCountProjectResources,
            findAllProjectResources,
        }
    } = queries

    router.post(
        '/resources',
        koaGuard({
            body: createResourceGuard,
            response: resourceGuard,
            status: [201, 400]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    body: {
                        resourceId,
                        config
                    }
                }
            } = ctx;

            ctx.body = await insertResource({
                id: generateStandardId(),
                signingKey: generateStandardSecret(),
                projectId: project.id,
                resourceId,
                config
            })

            ctx.status = 201;

            return next()
        }
    )

    router.get(
        '/resources',
        koaGuard({
            response: resourcePaginationResponseGuard,
            query: paginationGuard,
            status: [200, 400]
        }),
        async (ctx, next) => {

            const {
                project: {id},
                guard: {
                    query: {
                        pageSize,
                        offset,
                        page
                    }
                }
            } = ctx

            const [totalCount, items] = await Promise.all([
                getTotalCountProjectResources(id),
                findAllProjectResources(id, pageSize, offset)
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
        '/resources/:id',
        async (_ctx, next) => {

            return next();
        }
    )

    router.delete(
        '/resources/:id',
        async (_ctx, next) => {

            return next();
        }
    )
}
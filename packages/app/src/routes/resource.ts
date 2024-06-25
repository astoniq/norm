import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createResourceGuard,
    paginationGuard,
    resourceGuard,
    resourcePaginationResponseGuard, resourceResponseGuard,
} from "@astoniq/norm-schema";
import {generateStandardId, generateStandardSecret} from "@astoniq/norm-shared";
import {z} from "zod";

export default function resourceRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        resources: {
            insertResource,
            getTotalCountProjectResources,
            findAllProjectResources,
            findProjectResourceById,
            deleteProjectResourceById
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
                getTotalCountProjectResources(project.id),
                findAllProjectResources(project.id, pageSize, offset)
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
        koaGuard({
            params: z.object({id: z.string()}),
            response: resourceResponseGuard,
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

            ctx.body = await findProjectResourceById(project.id, id)

            return next();
        }
    )

    router.delete(
        '/resources/:id',
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

            await deleteProjectResourceById(project.id, id)

            ctx.status = 204;

            return next();
        }
    )
}
import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {createResourceGuard, resourceGuard} from "@astoniq/norm-schema";
import {generateStandardId, generateStandardSecret} from "@astoniq/norm-shared";

export default function resourceRoutes<T extends TenantRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        resources: {
            insertResource
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
                tenant,
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
                tenantId: tenant.id,
                resourceId,
                config
            })

            ctx.status = 201;

            return next()
        }
    )

    router.get(
        '/resources',
        async (_ctx, next) => {

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
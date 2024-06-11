import {AnonymousRouter, RouterInitArgs} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {resourceGuard} from "@astoniq/norm-schema";
import {generateStandardId, generateStandardSecret} from "@astoniq/norm-shared";

export default function resourceRoutes<T extends AnonymousRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        resources: {
            insertResource
        }
    } = queries

    router.post(
        '/resources',
        koaGuard({
            body: resourceGuard.omit({id: true, signingKey: true}),
            response: resourceGuard,
            status: [201, 400]
        }),
        async (ctx, next) => {

            const {
                body,
            } = ctx.guard

            ctx.body = await insertResource({
                ...body,
                id: generateStandardId(),
                signingKey: generateStandardSecret()
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
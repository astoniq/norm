import {AnonymousRouter, RouterInitArgs} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {z} from "zod";

export default function connectorRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.get(
        '/connectors',
        koaGuard({
            params: z.object({tenantId: z.string()})
        }),
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
        '/connectors',
        async (_ctx, next) => {

            return next()
        }
    )

    router.get(
        '/connectors/:id',
        async (_ctx, next) => {

            return next();
        }
    )

    router.delete(
        '/connectors/:id',
        async (_ctx, next) => {

            return next();
        }
    )
}
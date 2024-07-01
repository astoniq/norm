import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    connectorResponseGuard,
} from "@astoniq/norm-schema";

export default function connectorRoutes<T extends TenantRouter>(...[router, {queries, libraries}]: RouterInitArgs<T>) {

    const {
        connectors: {
            findProjectConnectors
        }
    } = queries

    const {
        connectors: {
            transpileConnectors
        }
    } = libraries

    router.get(
        '/connectors',
        koaGuard({
            response: connectorResponseGuard.array(),
            status: [200, 400]
        }),
        async (ctx, next) => {

            const {
                project
            } = ctx

            const connectors = await findProjectConnectors(project.id)

            ctx.body = transpileConnectors(connectors)

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
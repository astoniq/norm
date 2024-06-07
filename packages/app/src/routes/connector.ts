import {AnonymousRouter, RouterInitArgs} from "./types.js";

export default function connectorRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.get(
        '/tenants/:tenantId/connectors',
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
        '/tenants/:tenantId/connectors',
        async (_ctx, next) => {

            return next()
        }
    )

    router.get(
        '/tenants/:tenantId/connectors/:id',
        async (_ctx, next) => {

            return next();
        }
    )

    router.delete(
        '/tenants/:tenantId/connectors/:id',
        async (_ctx, next) => {

            return next();
        }
    )
}
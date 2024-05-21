import {AnonymousRouter, RouterInitArgs} from "./types.js";

export default function connectorRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.get(
        '/connectors',
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
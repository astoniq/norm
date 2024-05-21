import {AnonymousRouter, RouterInitArgs} from "./types.js";

export default function resourceRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.get(
        '/resources',
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
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
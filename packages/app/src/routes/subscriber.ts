import {AnonymousRouter, RouterInitArgs} from "./types.js";

export default function subscriberRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.get(
        '/subscribers',
        async (_ctx, next) => {

            return next()
        }
    )

    router.get(
        '/subscribers/:id',
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
        '/subscribers',
        async (_ctx, next) => {

            return next();
        }
    )

    router.post(
        '/subscribers/bulk',
        async (_ctx, next) => {

            return next();
        }
    )

    router.put(
        '/subscribers/:id',
        async (_ctx, next) => {

            return next();
        }
    )

    router.delete(
        '/subscribers/:id',
        async (_ctx, next) => {

            return next();
        }
    )
}
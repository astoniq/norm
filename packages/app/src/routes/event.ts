import {AuthedRouter, RouterInitArgs} from "./types.js";

export default function eventRoutes<T extends AuthedRouter>(...[router]: RouterInitArgs<T>) {

    router.post(
        '/events/trigger',
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
        '/events/trigger/bulk',
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
        '/events/trigger/broadcast',
        async (_ctx, next) => {

            return next();
        }
    )
}
import {AnonymousRouter, RouterInitArgs} from "./types.js";

export default function tenantRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.get(
        '/tenant',
        async (_ctx, next) => {

            return next()
        }
    )
}
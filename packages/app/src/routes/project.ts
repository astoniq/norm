import {AnonymousRouter, RouterInitArgs} from "./types.js";

export default function projectRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.get(
        '/projects',
        async (_ctx, next) => {

            return next()
        }
    )
}
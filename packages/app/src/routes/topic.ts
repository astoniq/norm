import {AnonymousRouter, RouterInitArgs} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {topicGuard} from "@astoniq/norm-schema";
import {object, string} from "zod";

export default function topicRoutes<T extends AnonymousRouter>(...[router]: RouterInitArgs<T>) {

    router.post(
        '/topics',
        async (_ctx, next) => {

            return next()
        }
    )

    router.get(
        '/topics/:id',
        koaGuard({
            params: object({id: string().min(1)}),
            response: topicGuard,
            status: [200, 404]
        }),
        async (_ctx, next) => {

            return next()
        }
    )

    router.delete(
        '/topics/:id',
        koaGuard({
            params: object({id: string().min(1)}),
            status: [204, 404]
        }),
        async (_ctx, next) => {

            return next();
        }
    )
}
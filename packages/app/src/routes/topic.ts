import {AuthedRouter, RouterInitArgs} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {createTopicGuard, topicGuard} from "@astoniq/norm-schema";
import {object, string} from "zod";

export default function topicRoutes<T extends AuthedRouter>(...[router]: RouterInitArgs<T>) {

    router.post(
        '/topics',
        koaGuard({
            body: createTopicGuard.omit({id: true}),
            status: [200, 400, 404],
            response: topicGuard
        }),
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
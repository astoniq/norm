import {AnonymousRouter, RouterInitArgs} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {triggerEventGuard} from "@astoniq/norm-schema";
import {generateStandardId} from "../utils/id.js";

export default function eventRoutes<T extends AnonymousRouter>(...args: RouterInitArgs<T>) {

    const [
        router,
        {
            queues: {workflow}
        },
    ] = args;

    router.post(
        '/events',
        koaGuard({
            body: triggerEventGuard,
            status: [201, 400]
        }),
        async (ctx, next) => {

            const {body} = ctx.guard;

            await workflow.add({
                name: generateStandardId(),
                data: body
            })

            ctx.status = 201;

            return next()
        }
    )

    router.post(
        '/events/bulk',
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
        '/events/broadcast',
        async (_ctx, next) => {

            return next();
        }
    )
}
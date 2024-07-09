import {ClientRouter, RouterInitArgs} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {triggerEventGuard} from "@astoniq/norm-schema";
import {generateStandardId} from "../utils/id.js";

export default function eventRoutes<T extends ClientRouter>(...args: RouterInitArgs<T>) {

    const [
        router,
        {
            queues: {workflow},
            libraries: {
                resources: {
                    getProjectResourceByResourceId
                }
            }
        },
    ] = args;

    router.post(
        '/trigger',
        koaGuard({
            body: triggerEventGuard,
            status: [200, 400]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {body}
            } = ctx;

            const resource = await getProjectResourceByResourceId(
                project.id, body.resourceId)

            await workflow.add({
                name: generateStandardId(),
                data: {
                    event: body,
                    projectId: project.id,
                    resourceId: resource.id
                }
            })

            ctx.status = 200;

            return next()
        }
    )
}
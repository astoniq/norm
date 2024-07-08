import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createClientTopicGuard,
} from "@astoniq/norm-schema";
import {generateStandardId} from "@astoniq/norm-shared";

export default function topicRoutes<T extends ClientRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        topics: {
            insertTopic
        }
    } = queries

    router.post(
        '/topics',
        koaGuard({
            body: createClientTopicGuard,
            status: [201, 400]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    body: {
                        topicId
                    }
                }
            } = ctx;

            await insertTopic({
                id: generateStandardId(),
                projectId: project.id,
                topicId
            })

            ctx.status = 201;

            return next()
        }
    )
}
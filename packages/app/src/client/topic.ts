import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createClientTopicGuard,
    topicClientResponseGuard,
} from "@astoniq/norm-schema";
import {object, string} from "zod";
import {generateStandardId} from "@astoniq/norm-shared";

export default function topicRoutes<T extends ClientRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        topics: {
            insertTopic,
            findProjectTopicById,
        }
    } = queries

    router.post(
        '/topics',
        koaGuard({
            body: createClientTopicGuard,
            response: topicClientResponseGuard,
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

            ctx.body = await insertTopic({
                id: generateStandardId(),
                projectId: project.id,
                topicId
            })

            ctx.status = 201;

            return next()
        }
    )

    router.get(
        '/topics/:id',
        koaGuard({
            params: object({id: string().min(1)}),
            response: topicClientResponseGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {


            const {
                project,
                guard: {
                    params: {
                        id
                    }
                }
            } = ctx

            ctx.body = await findProjectTopicById(project.id, id)

            return next();
        }
    )
}
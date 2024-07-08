import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
   createClientTopicSubscribersGuard,
} from "@astoniq/norm-schema";
import {generateStandardId} from "@astoniq/norm-shared";

export default function topicSubscriberRoutes<T extends ClientRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        topics: {
            findProjectTopicByTopicId,
        },
        topicSubscribers: {
            insertProjectTopicSubscribers
        },
        subscribers: {
            findProjectSubscriberBySubscriberId
        }
    } = queries

    router.post(
        '/topics/subscribers',
        koaGuard({
            body: createClientTopicSubscribersGuard,
            status: [201, 400, 422]
        }),
        async (ctx, next) => {

            const {
                project: {
                    id: projectId
                },
                guard: {
                    body: {
                        topicId,
                        subscriberIds
                    }
                }
            } = ctx;

            await findProjectTopicByTopicId(projectId, topicId);

            await Promise.all(
                subscriberIds.map(async (subscriberId) =>
                    findProjectSubscriberBySubscriberId(projectId, subscriberId))
            )

            await insertProjectTopicSubscribers(
                subscriberIds.map(subscriberId => ({
                    id: generateStandardId(),
                    projectId: projectId,
                    topicId,
                    subscriberId
                }))
            )

            ctx.status = 201;

            return next()
        }
    )

}
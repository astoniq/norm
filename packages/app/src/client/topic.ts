import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createClientTopicGuard,
} from "@astoniq/norm-schema";
import {generateStandardId} from "@astoniq/norm-shared";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";

export default function topicRoutes<T extends ClientRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        topics: {
            insertTopic
        },
        topicSubscribers: {
            insertProjectTopicSubscribers
        },
        subscribers: {
            findProjectSubscriberBySubscriberId
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

           const topic = await insertTopic({
                id: generateStandardId(),
                projectId,
                topicId
            })

            assertThat(topic, new RequestError({
                    code: 'db.not_found',
                    status: 400,
                })
            );

           if (subscriberIds) {

               await Promise.all(
                   subscriberIds.map(async (subscriberId) =>
                       findProjectSubscriberBySubscriberId(projectId, subscriberId))
               )

               await insertProjectTopicSubscribers(
                   subscriberIds.map(subscriberId => ({
                       id: generateStandardId(),
                       projectId,
                       topicId,
                       subscriberId
                   }))
               )
           }

            ctx.status = 201;

            return next()
        }
    )
}
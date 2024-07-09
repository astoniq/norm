import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createClientTopicGuard, removeClientTopicGuard,
} from "@astoniq/norm-schema";
import {generateStandardId} from "@astoniq/norm-shared";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";

export default function topicRoutes<T extends ClientRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        pool,
        topics: {
            insertTopic,
            deleteProjectTopicByTopicId
        },
        topicSubscribers: {
            insertProjectTopicSubscribers
        },
        subscribers: {
            findProjectSubscriberBySubscriberId
        }
    } = queries

    router.post(
        '/createTopic',
        koaGuard({
            body: createClientTopicGuard,
            status: [200, 400]
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

                await pool.transaction(async (transaction) => {
                    await Promise.all(
                        subscriberIds.map(async (subscriberId) =>
                            insertProjectTopicSubscribers(transaction, {
                                id: generateStandardId(),
                                projectId,
                                topicId,
                                subscriberId
                            }))
                    )
                })
            }

            ctx.status = 200;

            return next()
        }
    )

    router.post(
        '/removeTopic',
        koaGuard({
            body: removeClientTopicGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {

            const {
                project: {
                    id: projectId
                },
                guard: {
                    body: {
                        topicId
                    }
                }
            } = ctx

            await deleteProjectTopicByTopicId(projectId, topicId)

            ctx.status = 200;

            return next();
        }
    )
}
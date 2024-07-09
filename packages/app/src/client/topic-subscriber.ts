import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createClientTopicSubscribersGuard,
    removeClientTopicSubscribersGuard,
} from "@astoniq/norm-schema";
import {generateStandardId} from "@astoniq/norm-shared";

export default function topicSubscriberRoutes<T extends ClientRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        pool,
        topics: {
            findProjectTopicByTopicId,
        },
        topicSubscribers: {
            insertProjectTopicSubscribers,
            deleteProjectTopicSubscriberBySubscriberId,
        },
        subscribers: {
            findProjectSubscriberBySubscriberId
        }
    } = queries

    router.post(
        '/addTopicSubscribers',
        koaGuard({
            body: createClientTopicSubscribersGuard,
            status: [200, 400, 422]
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

            ctx.status = 200;

            return next()
        }
    )

    router.post(
        '/removeTopicSubscribers',
        koaGuard({
            body: removeClientTopicSubscribersGuard,
            status: [200, 400, 422]
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

            await pool.transaction(async (transaction) => {
                await Promise.all(
                    subscriberIds.map(async (subscriberId) =>
                        deleteProjectTopicSubscriberBySubscriberId(transaction, projectId, topicId, subscriberId))
                )
            })

            ctx.status = 200;

            return next()
        }
    )

}
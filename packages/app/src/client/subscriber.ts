import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createClientSubscriberGuard, removeClientSubscriberGuard
} from "@astoniq/norm-schema";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";

export default function subscriberRoutes<T extends ClientRouter>(...[router, {queries, libraries}]: RouterInitArgs<T>) {

    const {
        subscribers: {
            getSubscriber,
            updateSubscriberReferences,
        }
    } = libraries

    const {
        subscribers: {
            deleteProjectSubscriberBySubscriberId
        }
    } = queries

    router.post(
        '/createSubscriber',
        koaGuard({
            body: createClientSubscriberGuard,
            status: [201, 400]
        }),
        async (ctx, next) => {

            const {
                project: {
                    id: projectId
                },
                guard: {
                    body
                }
            } = ctx;

            const subscriber = await getSubscriber(projectId, body)

            assertThat(subscriber, new RequestError({
                    code: 'db.not_found',
                    status: 400,
                })
            );

            await updateSubscriberReferences(projectId, subscriber, body);

            ctx.status = 201;

            return next()
        }
    )

    router.post(
        '/removeSubscriber',
        koaGuard({
            body: removeClientSubscriberGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {

            const {
                project: {
                    id: projectId
                },
                guard: {
                    body: {
                        subscriberId
                    }
                }
            } = ctx

            await deleteProjectSubscriberBySubscriberId(projectId, subscriberId)

            ctx.status = 200;

            return next();
        }
    )
}
import {RouterInitArgs, ClientRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    createClientSubscriberReferencesGuard,
    removeClientSubscriberReferencesGuard
} from "@astoniq/norm-schema";
import {generateStandardId} from "@astoniq/norm-shared";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";

export default function subscriberReferenceRoutes<T extends ClientRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        pool,
        subscriberReferences: {
            upsertSubscriberReference,
            deleteProjectTopicSubscriberReferenceByReferenceId
        },
        subscribers: {
            findProjectSubscriberBySubscriberId
        }
    } = queries

    router.post(
        '/addSubscriberReferences',
        koaGuard({
            body: createClientSubscriberReferencesGuard,
            status: [200, 400]
        }),
        async (ctx, next) => {

            const {
                project: {
                    id: projectId
                },
                guard: {
                    body: {
                        subscriberId,
                        references
                    }
                }
            } = ctx;

            const subscriber = await findProjectSubscriberBySubscriberId(projectId, subscriberId)

            assertThat(references, new RequestError({
                    code: 'db.not_found',
                    status: 400,
                })
            );

            for (const reference of references) {

                await upsertSubscriberReference({
                    id: generateStandardId(),
                    projectId,
                    subscriberId: subscriber.id,
                    referenceId: reference.referenceId,
                    target: reference.target,
                    credentials: reference.credentials
                })
            }

            ctx.status = 201;

            return next()
        }
    )

    router.post(
        '/removeSubscriberReferences',
        koaGuard({
            body: removeClientSubscriberReferencesGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {

            const {
                project: {
                    id: projectId
                },
                guard: {
                    body: {
                        subscriberId,
                        referenceIds
                    }
                }
            } = ctx

            await findProjectSubscriberBySubscriberId(projectId, subscriberId)

            await pool.transaction(async (transaction) => {
                referenceIds.map(async (referenceId) =>
                    deleteProjectTopicSubscriberReferenceByReferenceId(
                        transaction, projectId, subscriberId, referenceId))
            })

            ctx.status = 204;

            return next();
        }
    )
}
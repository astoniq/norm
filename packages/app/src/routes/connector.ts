import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {
    connectorResponseGuard, createConnectorGuard, patchConnectorGuard,
} from "@astoniq/norm-schema";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";
import {generateStandardId} from "@astoniq/norm-shared";
import {object, string, z} from "zod";
import {validateConfig} from "@astoniq/norm-connectors";
import {conditionalObject} from "@astoniq/essentials";

export default function connectorRoutes<T extends TenantRouter>(...[router, {queries, libraries}]: RouterInitArgs<T>) {

    const {
        connectors: {
            findAllProjectConnectors,
            findProjectConnectorById,
            deleteProjectConnectorById,
            insertConnector,
            updateProjectConnectorById
        }
    } = queries

    const {
        connectors: {
            findConnectorFactory,
        }
    } = libraries

    const {
        connectors: {
            transpileConnectors,
            transpileConnector
        }
    } = libraries

    router.get(
        '/connectors',
        koaGuard({
            response: connectorResponseGuard.array(),
            status: [200, 400]
        }),
        async (ctx, next) => {

            const {
                project
            } = ctx

            const connectors = await findAllProjectConnectors(project.id)

            ctx.body = transpileConnectors(connectors)

            return next()
        }
    )

    router.post(
        '/connectors',
        koaGuard({
            body: createConnectorGuard,
            response: connectorResponseGuard,
            status: [201, 400, 422]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    body: {connectorId, name}
                }
            } = ctx

            const connectorFactory = findConnectorFactory(name);

            assertThat(
                connectorFactory,
                new RequestError({
                    code: 'db.not_found',
                    status: 422,
                })
            );

            const connector = await insertConnector({
                id: generateStandardId(),
                projectId: project.id,
                connectorId,
                name,
            })

            ctx.body = transpileConnector(connector, connectorFactory)

            ctx.status = 201;

            return next()
        }
    )

    router.get(
        '/connectors/:id',
        koaGuard({
            params: object({id: string().min(1)}),
            response: connectorResponseGuard,
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

            const connector = await findProjectConnectorById(project.id, id)

            const connectorFactory = findConnectorFactory(connector.name);

            assertThat(
                connectorFactory,
                new RequestError({
                    code: 'db.not_found',
                    status: 422,
                })
            );

            ctx.body = transpileConnector(connector, connectorFactory)

            return next();
        }
    )

    router.patch(
        '/connectors/:id',
        koaGuard({
            params: z.object({id: z.string()}),
            body: patchConnectorGuard,
            response: connectorResponseGuard,
            status: [200, 400, 404]
        }),
        async (ctx, next) => {

            const {
                project,
                guard: {
                    body: {config, connectorId},
                    params: {id}
                }
            } = ctx

            const connector = await findProjectConnectorById(project.id, id)

            const connectorFactory = findConnectorFactory(connector.name);

            assertThat(
                connectorFactory,
                new RequestError({
                    code: 'db.not_found',
                    status: 422,
                })
            );

            if (config) {
                validateConfig(config, connectorFactory.configGuard)
            }

            const updatedConnector = await updateProjectConnectorById(project.id, id,
                conditionalObject({
                    connectorId,
                    config
                })
            )

            ctx.body = transpileConnector(updatedConnector, connectorFactory)

            return next();
        }
    )

    router.delete(
        '/connectors/:id',
        koaGuard({
            params: z.object({id: z.string()}),
            status: [204, 404]
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

            await deleteProjectConnectorById(project.id, id)

            ctx.status = 204;

            return next();
        }
        )
}
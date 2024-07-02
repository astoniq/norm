import {RouterInitArgs, TenantRouter} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {connectorFactoryResponseGuard} from "@astoniq/norm-schema";
import {z} from "zod";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";

export default function connectorFactoryRoutes<T extends TenantRouter>(...[router, {libraries}]: RouterInitArgs<T>) {

    const {
        connectors: {
            transpileConnectorsFactory,
            findConnectorFactory,
            transpileConnectorFactory
        }
    } = libraries

    router.get(
        '/connector-factories',
        koaGuard({
            response: connectorFactoryResponseGuard.array(),
            status: [200, 400]
        }),
        async (ctx, next) => {

            ctx.body = transpileConnectorsFactory()

            return next()
        }
    )

    router.get(
        '/connector-factories/:name',
        koaGuard({
            params: z.object({name: z.string().min(1)}),
            response: connectorFactoryResponseGuard,
            status: [200, 404],
        }),
        async (ctx, next) => {
            const {
                params: {name},
            } = ctx.guard;

            const connectorFactory = findConnectorFactory(name);

            assertThat(
                connectorFactory,
                new RequestError({
                    code: 'db.not_found',
                    status: 404,
                })
            );

            ctx.body = transpileConnectorFactory(connectorFactory);

            return next();
        }
    );
}
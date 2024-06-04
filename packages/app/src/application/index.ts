import Koa from "koa";
import mount from 'koa-mount';
import {loadConfig} from "../config/index.js";
import {createDbPool} from "../database/index.js";
import {createQueries} from "../queries/index.js";
import koaErrorHandler from "../middlewares/koa-error-handler.js";
import {createQueues} from "../queues/index.js";
import {initApis} from "../routes/index.js";
import {createRedis} from "./redis.js";
import {createWorkers} from "../workers/index.js";
import {createLibraries} from "../libraries/index.js";
import {initClient} from "../client/index.js";

const serverTimeout = 120_000;

export async function initApp() {

    const config = loadConfig()

    const pool = await createDbPool(
        config.databaseUrl,
        config.isUnitTest,
        config.databasePoolSize
    )

    const redis = createRedis(config.redisUrl);

    const queries = createQueries(pool);

    const libraries = createLibraries(queries);

    const queues = createQueues(redis)

    createWorkers({
        queries,
        libraries,
        queues,
        redis
    })

    const app = new Koa()

    app.use(koaErrorHandler())

    app.use(mount('/api', initApis({
        queues,
        queries
    })));

    app.use(mount('/client', initClient({
        queues,
        queries
    })));

    const server = app.listen(3000);

    server.setTimeout(serverTimeout)
}
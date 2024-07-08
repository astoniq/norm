import {ApplicationContext} from "../application/types.js";
import Koa from 'koa';
import Router from "koa-router";
import eventRoutes from "./event.js";
import {ClientRouter} from "./types.js";
import koaProjectClient from "../middlewares/koa-project-client.js";
import topicRoutes from "./topic.js";
import topicSubscriberRoutes from "./topic-subscriber.js";

const createRouters = (application: ApplicationContext) => {

    const clientRouter: ClientRouter = new Router();

    clientRouter.use(koaProjectClient(application.queries))

    eventRoutes(clientRouter, application)
    topicRoutes(clientRouter, application)
    topicSubscriberRoutes(clientRouter, application)

    return [clientRouter]
}

export function initClient(application: ApplicationContext): Koa {

    const apisApp = new Koa()

    for (const router of createRouters(application)) {
        apisApp.use(router.routes()).use(router.allowedMethods())
    }

    return apisApp;
}
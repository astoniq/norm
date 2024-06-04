import {ApplicationContext} from "../application/types.js";
import Koa from 'koa';
import Router from "koa-router";
import eventRoutes from "./event.js";
import {AnonymousRouter} from "./types.js";

const createRouters = (application: ApplicationContext) => {

    const anonymousRouter: AnonymousRouter = new Router();

    eventRoutes(anonymousRouter, application)

    return [anonymousRouter]
}

export function initClient(application: ApplicationContext): Koa {

    const apisApp = new Koa()

    for (const router of createRouters(application)) {
        apisApp.use(router.routes()).use(router.allowedMethods())
    }

    return apisApp;
}
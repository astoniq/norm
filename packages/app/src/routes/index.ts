import {ApplicationContext} from "../application/types.js";
import Koa from 'koa';
import Router from "koa-router";
import {AnonymousRouter} from "./types.js";
import resourceRoutes from "./resource.js";

const createRouters = (application: ApplicationContext) => {

    const anonymousRouter: AnonymousRouter = new Router();

    resourceRoutes(anonymousRouter, application)

    return [anonymousRouter]
}

export function initApis(application: ApplicationContext): Koa {

    const apisApp = new Koa()

    for (const router of createRouters(application)) {
        apisApp.use(router.routes()).use(router.allowedMethods())
    }

    return apisApp;
}
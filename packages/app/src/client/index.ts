import {ApplicationContext} from "../application/types.js";
import Koa from 'koa';
import Router from "koa-router";
import eventRoutes from "./event.js";
import {ClientRouter} from "./types.js";
import koaTenant from "../middlewares/koa-tenant.js";

const createRouters = (application: ApplicationContext) => {

    const clientRouter: ClientRouter = new Router();

    clientRouter.use(koaTenant(application.queries))

    eventRoutes(clientRouter, application)

    return [clientRouter]
}

export function initClient(application: ApplicationContext): Koa {

    const apisApp = new Koa()

    for (const router of createRouters(application)) {
        apisApp.use(router.routes()).use(router.allowedMethods())
    }

    return apisApp;
}
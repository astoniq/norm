import {ApplicationContext} from "../application/types.js";
import Koa from 'koa';
import Router from "koa-router";
import {TenantRouter} from "./types.js";
import resourceRoutes from "./resource.js";
import koaTenant from "../middlewares/koa-tenant.js";

const createRouters = (application: ApplicationContext) => {

    const tenantRouter: TenantRouter = new Router();

    tenantRouter.use(koaTenant(application.queries))

    resourceRoutes(tenantRouter, application)

    return [tenantRouter]
}

export function initApis(application: ApplicationContext): Koa {

    const apisApp = new Koa()

    for (const router of createRouters(application)) {
        apisApp.use(router.routes()).use(router.allowedMethods())
    }

    return apisApp;
}
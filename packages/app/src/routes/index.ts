import {ApplicationContext} from "../application/types.js";
import Koa from 'koa';
import Router from "koa-router";
import {TenantRouter} from "./types.js";
import resourceRoutes from "./resource.js";
import koaProject from "../middlewares/koa-project.js";
import topicRoutes from "./topic.js";
import connectorRoutes from "./connector.js";
import connectorFactoryRoutes from "./connector-factory.js";
import subscriberRoutes from "./subscriber.js";

const createRouters = (application: ApplicationContext) => {

    const tenantRouter: TenantRouter = new Router();

    tenantRouter.use(koaProject(application.queries))

    resourceRoutes(tenantRouter, application)
    topicRoutes(tenantRouter, application)
    connectorRoutes(tenantRouter, application)
    connectorFactoryRoutes(tenantRouter, application)
    subscriberRoutes(tenantRouter, application)

    return [tenantRouter]
}

export function initApis(application: ApplicationContext): Koa {

    const apisApp = new Koa()

    for (const router of createRouters(application)) {
        apisApp.use(router.routes()).use(router.allowedMethods())
    }

    return apisApp;
}
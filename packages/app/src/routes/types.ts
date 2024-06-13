import Router from "koa-router";
import {ExtendableContext} from "koa";
import {ApplicationContext} from "../application/types.js";
import {WithTenantContext} from "../middlewares/koa-tenant.js";

export type AnonymousRouter = Router<unknown, ExtendableContext>;

export type TenantRouter = Router<unknown, ExtendableContext & WithTenantContext>;

type RouterInit<T> = (router: T, application: ApplicationContext) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;
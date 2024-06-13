import Router from "koa-router";
import {ExtendableContext} from "koa";
import {ApplicationContext} from "../application/types.js";
import {WithTenantClientContext} from "../middlewares/koa-tenant-client.js";

export type ClientRouter = Router<unknown, ExtendableContext & WithTenantClientContext>;

type RouterInit<T> = (router: T, application: ApplicationContext) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;
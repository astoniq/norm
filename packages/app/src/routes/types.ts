import Router from "koa-router";
import {ExtendableContext} from "koa";
import {ApplicationContext} from "../application/types.js";
import {WithProjectContext} from "../middlewares/koa-project.js";

export type AnonymousRouter = Router<unknown, ExtendableContext>;

export type TenantRouter = Router<unknown, ExtendableContext & WithProjectContext>;

type RouterInit<T> = (router: T, application: ApplicationContext) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;
import Router from "koa-router";
import {ExtendableContext} from "koa";
import {ApplicationContext} from "../application/types.js";
import {WithProjectClientContext} from "../middlewares/koa-project-client.js";

export type ClientRouter = Router<unknown, ExtendableContext & WithProjectClientContext>;

type RouterInit<T> = (router: T, application: ApplicationContext) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;
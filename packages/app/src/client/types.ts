import Router from "koa-router";
import {ExtendableContext} from "koa";
import {ApplicationContext} from "../application/types.js";

export type AnonymousRouter = Router<unknown, ExtendableContext>;

type RouterInit<T> = (router: T, application: ApplicationContext) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;
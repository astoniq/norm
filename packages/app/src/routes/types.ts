import Router from "koa-router";
import {ExtendableContext} from "koa";

export type AuthedRouter = Router<unknown, ExtendableContext>;

type RouterInit<T> = (router: T) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;
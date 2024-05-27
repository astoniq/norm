import Router from 'koa-router';
import koaBody from 'koa-body';
import Koa from 'koa';
import {handler} from "./handler.js";

const router = new Router();
const app = new Koa();

router.all('/', handler);

app
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
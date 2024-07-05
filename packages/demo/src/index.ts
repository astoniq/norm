import Router from 'koa-router';
import koaBody from 'koa-body';
import Koa from 'koa';
import {handler} from "./handler.js";
import {Norm, TriggerAddressingType, TriggerRecipientsType} from "@astoniq/norm-node";

const router = new Router();
const app = new Koa();

const norm = new Norm({
    clientKey: 'Ez0w33oKVeRFhYKV2a1bJNglg7uwC9Pq',
    baseUrl: 'http://localhost:3000/client'
})

router.get('/trigger', async (ctx, next) => {

   await norm.trigger({
       type: TriggerAddressingType.Multicast,
       to: {
           type: TriggerRecipientsType.Subscriber,
           recipient: {
               subscriberId: "2"
           }
       },
       payload: {
           username: "1"
       },
       resourceId: "demo",
       notificationId: "hello"
    })

    ctx.status = 200;

    return next()
});

router.get('/topics', async (ctx, next) => {

    await norm.topics.create({
        topicId: 'test1'
    })

    ctx.status = 200;

    return next()
});

router.all('/norm', handler);

app
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(4002);
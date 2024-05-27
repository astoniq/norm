import {EchoRequestHandler} from "@astoniq/norm-sdk";
import {client} from "./client.js";
import Koa from "koa";

export const serve = new EchoRequestHandler({
    client,
    handler: (ctx: Koa.ParameterizedContext) => ({
        body: () => ctx.request.body,
        headers: (key) => ctx.get(key),
        method: () => ctx.method,
        url: () => ctx.URL,
        queryString: (key) => String(ctx.query[key]),
        transformResponse: ({headers, body, status}) => {

            Object.entries(headers).forEach(([headerName, headerValue]) => {
                ctx.set(headerName, headerValue);
            });

            ctx.status = status
            ctx.body = body
        }
    })
})

export const handler = serve.createHandler()
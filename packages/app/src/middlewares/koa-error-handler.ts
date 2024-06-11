import {HttpError, Middleware} from "koa";
import {RequestErrorBody} from "@astoniq/norm-schema";
import {RequestError} from "../errors/index.js";
import {logger} from "../utils/logger.js";

export default function koaErrorHandler<StateT, ContextT, BodyT>(): Middleware<
    StateT, ContextT, BodyT | RequestErrorBody | { message: string }> {
    return async (ctx, next) => {
        try {
            await next()
        } catch (error: unknown) {

            if (error instanceof RequestError) {
                ctx.status = error.status
                ctx.body = error.body

                return;
            }

            if (error instanceof HttpError) {
                return;
            }

            logger.error(error);

            ctx.status = 500;
            ctx.body = {message: "Internal server error."}
        }
    }
}
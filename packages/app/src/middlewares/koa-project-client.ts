import {IRouterParamContext} from "koa-router";
import {Project} from "@astoniq/norm-schema";
import {Middleware} from "koa";
import {Queries} from "../queries/index.js";
import type {IncomingHttpHeaders} from 'http';
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";

export type WithProjectClientContext<ContextT extends IRouterParamContext = IRouterParamContext> =
    ContextT & { project: Project }

const clientKeyIdentifier = 'ClientKey';

export const extractClientKeyFromHeaders = ({authorization}: IncomingHttpHeaders) => {

    assertThat(authorization,
        new RequestError({code: 'auth.authorization_header_missing', status: 401}))

    assertThat(authorization.startsWith(clientKeyIdentifier),
        new RequestError({code: 'auth.authorization_token_type_not_supported', status: 401}))

    return authorization.slice(clientKeyIdentifier.length + 1);
}

export default function koaProjectClient<
    StateT,
    ContextT extends IRouterParamContext,
    ResponseBodyT
>({
      projects
  }: Queries): Middleware<StateT, WithProjectClientContext<ContextT>, ResponseBodyT> {

    return async (ctx, next) => {

        try {

            const clientKey = extractClientKeyFromHeaders(ctx.headers)

            const project = await projects.findProjectByClientKey(clientKey)

            assertThat(project,
                new RequestError({code: 'auth.unauthorized', status: 401}))

            ctx.project = project;

            return next();
        } catch (error) {
            if (error instanceof RequestError) {
                throw error
            }

            throw new RequestError({code: 'auth.unauthorized', status: 401}, error)
        }

    }
}


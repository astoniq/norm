import {IRouterParamContext} from "koa-router";
import {Project} from "@astoniq/norm-schema";
import {Middleware} from "koa";
import {Queries} from "../queries/index.js";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";
import {projectIdHeaderKey} from "@astoniq/norm-schema";

export type WithProjectContext<ContextT extends IRouterParamContext = IRouterParamContext> =
    ContextT & { project: Project }

export default function koaProject<
    StateT,
    ContextT extends IRouterParamContext,
    ResponseBodyT
>({
      projects
  }: Queries): Middleware<StateT, WithProjectContext<ContextT>, ResponseBodyT> {

    return async (ctx, next) => {

        const projectId = ctx.get(projectIdHeaderKey);

        assertThat(projectId,
            new RequestError({code: 'project.id_header_missing', status: 400}))

        const project = await projects.findProjectById(projectId)

        assertThat(project,
            new RequestError({code: 'project.id_not_found', status: 400}))

        ctx.project = project;

        return next();
    }
}


import {AnonymousRouter, RouterInitArgs} from "./types.js";
import koaGuard from "../middlewares/koa-guard.js";
import {object, string, z} from "zod";
import {
    createProjectGuard,
    paginationGuard,
    patchProjectGuard, projectGuard, projectPaginationResponseGuard,
    projectResponseGuard,
} from "@astoniq/norm-schema";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";
import {generateStandardId} from "@astoniq/norm-shared";
import {generateStandardSecret} from "../utils/id.js";

export default function projectRoutes<T extends AnonymousRouter>(...[router, {queries}]: RouterInitArgs<T>) {

    const {
        projects: {
            findProjectById,
            findAllProjects,
            getTotalCountProjects,
            insertProject,
            updateProjectById
        }
    } = queries

    router.post(
        '/projects',
        koaGuard({
            body: createProjectGuard,
            response: projectGuard,
            status: [201, 400]
        }),
        async (ctx, next) => {

            const {
                guard: {
                    body: {
                        projectId
                    }
                }
            } = ctx;

            ctx.body = await insertProject({
                id: generateStandardId(),
                projectId,
                clientKey: generateStandardSecret()
            })

            ctx.status = 201;

            return next()
        }
    )

    router.get(
        '/projects',
        koaGuard({
            response: projectPaginationResponseGuard,
            query: paginationGuard,
            status: [200, 400]
        }),
        async (ctx, next) => {

            const {
                guard: {
                    query: {
                        pageSize,
                        offset,
                        page
                    }
                }
            } = ctx

            const [totalCount, items] = await Promise.all([
                getTotalCountProjects(),
                findAllProjects(pageSize, offset)
            ])

            ctx.body = {
                page,
                pageSize,
                totalCount,
                items
            }

            return next()
        }
    )

    router.get(
        '/projects/:id',
        koaGuard({
            params: object({id: string().min(1)}),
            response: projectResponseGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {


            const {
                guard: {
                    params: {
                        id
                    }
                }
            } = ctx

            const project = await findProjectById(id)

            assertThat(project,
                new RequestError({code: 'project.id_not_found', status: 404}))

            ctx.body = project

            return next();
        }
    )

    router.patch(
        '/projects/:id',
        koaGuard({
            params: z.object({id: z.string()}),
            body: patchProjectGuard,
            response: projectResponseGuard,
            status: [200, 404]
        }),
        async (ctx, next) => {

            const {
                guard: {
                    body,
                    params: {
                        id
                    }
                }
            } = ctx

            ctx.body = await updateProjectById(id, body)

            return next();
        }
    )
}
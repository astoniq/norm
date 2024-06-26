import {Queries} from "../queries/index.js";
import {assert} from "@astoniq/essentials";
import {RequestError} from "../errors/index.js";

export const createResourceLibrary = (queries: Queries) => {

    const {
        resources: {
            findProjectResourceByResourceId
        }
    } =queries

    const getProjectResourceByResourceId = async (projectId: string, resourceId: string) => {

        const resource = await findProjectResourceByResourceId(projectId, resourceId);

        assert(resource, new RequestError({
            code: 'guard',
            status: 400
        }))

        return resource;
    }

    return {
        getProjectResourceByResourceId
    }
}
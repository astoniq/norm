import {Queries} from "../queries/index.js";
import {RequestError} from "../errors/index.js";
import assertThat from "../utils/assert-that.js";

export const createResourceLibrary = (queries: Queries) => {

    const {
        resources: {
            findProjectResourceEnabledByResourceId
        }
    } =queries

    const getProjectResourceByResourceId = async (projectId: string, resourceId: string) => {

        const resource = await findProjectResourceEnabledByResourceId(projectId, resourceId);

        assertThat(resource, new RequestError({
            code: 'guard',
            status: 400
        }))

        return resource;
    }

    return {
        getProjectResourceByResourceId
    }
}
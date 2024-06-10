import {Queries} from "../queries/index.js";
import {assert} from "@astoniq/essentials";
import {RequestError} from "../errors/index.js";

export const createResourceLibrary = (queries: Queries) => {

    const {
        resources: {
            findResourceByResourceId
        }
    } =queries

    const getResourceByResourceId = async (resourceId: string) => {

        const resource = await findResourceByResourceId(resourceId);

        assert(resource, new RequestError({
            code: 'guard',
            status: 400
        }))

        return resource;
    }

    return {
        getResourceByResourceId
    }
}
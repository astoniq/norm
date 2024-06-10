import {Queries} from "../queries/index.js";
import {createConnectorLibrary} from "./connector.js";
import {createResourceLibrary} from "./resource.js";

export type Libraries = ReturnType<typeof createLibraries>

export const createLibraries = (queries: Queries) => {

    const connectors = createConnectorLibrary(queries)
    const resources = createResourceLibrary(queries)

    return {
        connectors,
        resources
    }
}
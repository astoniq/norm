import {Queries} from "../queries/index.js";
import {createConnectorLibrary} from "./connector.js";

export type Libraries = ReturnType<typeof createLibraries>

export const createLibraries = (queries: Queries) => {

    const connectors = createConnectorLibrary(queries)

    return {
        connectors
    }
}
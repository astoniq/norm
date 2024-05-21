import {createMockPool, createMockQueryResult, createPool, parseDsn} from "slonik";
import {assert} from "@astoniq/essentials";
import {createInterceptorsPreset} from "./interceptor-preset.js";

export const createDbPool = async (
    databaseDsn: string,
    mockDatabaseConnection: boolean,
    poolSize?: number
) => {
    if (mockDatabaseConnection) {
        return createMockPool({query: async () => createMockQueryResult([])})
    }

    assert(parseDsn(databaseDsn).databaseName, new Error("Database name is required in url"))

    return createPool(databaseDsn, {
        interceptors: createInterceptorsPreset(),
        maximumPoolSize: poolSize
    })

}
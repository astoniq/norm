import {createMockPool, createMockQueryResult, createPool, parseDsn} from "slonik";
import {assert} from "@astoniq/essentials";

const createDbPool = async (
    databaseDsn: string,
    mockDatabaseConnection: boolean,
    poolSize?: number
) => {
    if (mockDatabaseConnection) {
        createMockPool({query: async () => createMockQueryResult([])})
    }

    assert(parseDsn(databaseDsn).databaseName, new Error("Database name is required"))

    return createPool(databaseDsn, {
        interceptors: [],
        maximumPoolSize: poolSize
    })

}
import {assertEnv, getEnv, tryThat} from "@astoniq/essentials";

export type Config = ReturnType<typeof loadConfig>

export const loadConfig = () => {

    const databaseUrl = tryThat(() => assertEnv('DB_URL'), () => {
        throw new Error(`No Postgres DSN found in env key 'DB_URL' variables'`);
    });

    const redisUrl = tryThat(() => assertEnv('REDIS_URL'), () => {
        throw new Error(`No Redis url found in env key 'REDIS_URL' variables'`);
    });

    const isUnitTest = getEnv('NODE_ENV') === 'test';

    const databasePoolSize = Number(
        getEnv('DATABASE_POOL_SIZE', '20'));

    return {
        databaseUrl,
        redisUrl,
        isUnitTest,
        databasePoolSize
    }

}
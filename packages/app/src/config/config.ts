import {assertEnv, getEnv, tryThat} from "@astoniq/essentials";

export type Config = ReturnType<typeof loadConfig>

export const loadConfig = () => {

    const databaseUrl = tryThat(() => assertEnv('DB_URL'), () => {
        throw new Error(`No Postgres DSN found in env key 'DB_URL' variables'`);
    });

    const databasePoolSize = Number(
        getEnv('DATABASE_POOL_SIZE', '20'));

    return {
        databaseUrl,
        databasePoolSize
    }

}
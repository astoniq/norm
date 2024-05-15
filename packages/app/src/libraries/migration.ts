import {DatabasePool} from "slonik";
import {MigrationFile, MigrationScript} from "../types/index.js";
import {getCurrentDatabaseMigrationTimestamp, updateMigrationTimestamp} from "../queues/migration.js";
import {logger} from "../utils/logger.js";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";
import {existsSync} from "fs";
import fs from "fs/promises";

const currentDirname = path.dirname(fileURLToPath(import.meta['url']))

const getMigrationsFiles = async () => {

    const migrationDirectory = path.join(currentDirname, "..", "migrations");

    if (!existsSync(migrationDirectory)) {
        return []
    }

    const directory = await fs.readdir(migrationDirectory);

    return directory
        .filter((file) => alterationFilenameRegex.test(file))
        .slice()
        .sort((file1, file2) => getTimestampFromFilename(file1) - getTimestampFromFilename(file2))
        .map(filename => ({path: path.join(migrationDirectory, filename), filename}));
}

export const getAvailableMigrations = async (
    pool: DatabasePool,
    compareMode: 'gt' | 'lte' = 'gt',
    reverse: boolean,
    max?: number) => {

    const currentTimestamp = await getCurrentDatabaseMigrationTimestamp(pool);

    const files = await getMigrationsFiles()

    const availableFiles = files.filter(({filename}) =>
        compareMode === 'gt'
            ? getTimestampFromFilename(filename) > currentTimestamp
            : getTimestampFromFilename(filename) <= currentTimestamp
    )

    const resultFiles = reverse ? availableFiles.reverse() : availableFiles

    if (max) {
        return resultFiles.slice(0, max)
    }

    return resultFiles
}

const importMigrationScript = async (filePath: string): Promise<MigrationScript> => {

    const fileUrl = pathToFileURL(filePath).href;

    const module = await import(fileUrl);

    return module.default as MigrationScript;
};

const alterationFilenameRegex = /^([\d]+)-(.*).js$/;

const getTimestampFromFilename = (filename: string) => {
    const match = alterationFilenameRegex.exec(filename);

    if (!match?.[1]) {
        throw new Error(`Can not get timestamp: ${filename}`);
    }

    return Number(match[1]);
};

export const deployMigration = async (
    pool: DatabasePool,
    {path: filePath, filename}: MigrationFile,
    action: 'up' | 'down' = 'up'
) => {
    const {up, down} = await importMigrationScript(filePath);

    const timestamp = getTimestampFromFilename(filename);

    try {
        await pool.transaction(async (connection) => {
            if (action === 'up') {
                await up(connection);
                await updateMigrationTimestamp(connection, timestamp)
            }

            if (action === 'down') {
                await down(connection);
                if (timestamp > 1) {
                    await updateMigrationTimestamp(connection, timestamp - 1)
                }
            }
        });

    } catch (error) {
        logger.error(error, `Error during running migration timestamp (${timestamp})`);
        await pool.end();
    }

    logger.info(`Running migration ${filename} \`${action}\` succeeded`)
}


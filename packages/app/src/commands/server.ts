import type {CommandModule} from 'yargs';
import * as console from "console";
import {createDbPool} from "../database/index.js";

export const server: CommandModule = {
    command: ['*', 'server'],
    describe: 'Start server',
    handler: async () => {
        console.log('start server')

        const pool = await createDbPool('', true)

        console.log(pool)
    }
}
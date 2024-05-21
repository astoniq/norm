import type {CommandModule} from 'yargs';
import {initApp} from "../application/index.js";

export const server: CommandModule = {
    command: ['*', 'server'],
    describe: 'Start server',
    handler: initApp
}
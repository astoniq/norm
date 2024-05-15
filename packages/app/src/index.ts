import dotenv from 'dotenv';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {migrate, server} from "./commands/index.js";

void yargs(hideBin(process.argv))
    .scriptName('norm')
    .option('env', {
        alias: ['env-file'],
        describe: 'The path to your .env file',
        type: "string",
        default: '.env'
    })
    .middleware(({env}) => {
        dotenv.config({path: env});
    })
    .command(server)
    .command(migrate)
    .demandCommand(1, 'You need at least one command before moving on')
    .showHelpOnFail(false, `Specify --help for available options`)
    .strict()
    .parse()
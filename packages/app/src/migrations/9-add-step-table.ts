import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addResourceTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table steps
            (
                project_id      varchar(21)  not null
                    references projects (id) on update cascade on delete cascade,
                id              varchar(21)  not null,
                notification_id varchar(21)  not null,
                step_id         varchar(128) not null,
                type            varchar(128) not null,
                status          varchar(128) not null,
                output          jsonb        not null default '{}'::jsonb,
                result          jsonb        not null default '{}'::jsonb,
                primary key (id)
            );
            create index steps__id on steps (project_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table steps;
        `);
    }
}

export default addResourceTableMigrationScript
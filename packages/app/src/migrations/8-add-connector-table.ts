import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table connectors
            (
                project_id   varchar(21)  not null
                    references projects (id) on update cascade on delete cascade,
                id           varchar(21)  not null,
                connector_id varchar(128) not null,
                name         varchar(128) not null,
                enabled      boolean      not null default false,
                config       jsonb        not null default '{}'::jsonb,
                created_at   timestamptz  not null default (now()),
                primary key (id),
                constraint connectors__connector_id unique (project_id, connector_id)
            );
            create index connectors__id on connectors (project_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table connectors;
        `);
    }
}

export default migration
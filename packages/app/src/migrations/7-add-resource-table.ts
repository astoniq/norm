import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table resources
            (
                project_id  varchar(21)  not null
                    references projects (id) on update cascade on delete cascade,
                id          varchar(21)  not null,
                resource_id varchar(128) not null,
                signing_key varchar(64)  not null,
                enabled     boolean      not null default false,
                config      jsonb        not null,
                created_at  timestamptz  not null default (now()),
                primary key (id),
                constraint resources__resource_id unique (project_id, resource_id)
            );

            create index resources__id on resources (project_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table resources;
        `);
    }
}

export default migration
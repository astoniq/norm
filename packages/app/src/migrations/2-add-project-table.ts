import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table projects
            (
                id         varchar(21)  not null,
                project_id varchar(128) not null,
                client_key varchar(64)  not null,
                created_at timestamptz  not null default (now()),
                primary key (id),
                constraint projects_project__id unique (project_id)
            );
            create index projects__id on projects (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table projects;
        `);
    }
}

export default migration
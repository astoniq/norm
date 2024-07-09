import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table subscriber_references
            (
                project_id    varchar(21)  not null
                    references projects (id) on update cascade on delete cascade,
                id            varchar(21)  not null,
                subscriber_id varchar(21)  not null,
                reference_id  varchar(128) not null,
                target        varchar(128) not null,
                credentials   jsonb        not null,
                created_at    timestamptz  not null default (now()),
                primary key (id),
                constraint subscriber_references__subscriber_id_reference_id
                    unique (project_id, subscriber_id, reference_id)
            );
            create index subscriber_references__id on subscriber_references (project_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table subscriber_references;
        `);
    }
}

export default migration
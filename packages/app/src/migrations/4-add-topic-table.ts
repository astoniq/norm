import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table topics
            (
                project_id varchar(21)  not null
                    references projects (id) on update cascade on delete cascade,
                id         varchar(21)  not null,
                topic_id   varchar(128) not null,
                created_at timestamptz  not null default (now()),
                primary key (id),
                constraint topics__topic_id unique (project_id, topic_id)
            );
            create index topics__id on topics (project_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table topics;
        `);
    }
}

export default migration
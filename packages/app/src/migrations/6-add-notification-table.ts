import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table notifications
            (
                project_id      varchar(21)  not null
                    references projects (id) on update cascade on delete cascade,
                id              varchar(21)  not null,
                event_id        varchar(128) not null,
                notification_id varchar(128) not null,
                resource_id     varchar(21)  not null,
                subscriber_id   varchar(21)  not null,
                status          varchar(128) not null,
                payload         jsonb        not null,
                created_at      timestamptz  not null default (now()),
                primary key (id)
            );
            create index notifications__id on notifications (project_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table notifications;
        `);
    }
}

export default migration
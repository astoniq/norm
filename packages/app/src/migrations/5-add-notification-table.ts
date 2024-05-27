import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addTopicTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table notifications
            (
                id            varchar(21) not null,
                workflow_id      varchar(255) not null,
                resource_id varchar(21) not null,
                subscriber_id varchar(21) not null,
                status varchar(128) not null,
                payload jsonb,
                primary key (id)
            );
            create index notifications_id on notifications (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table notifications;
        `);
    }
}

export default addTopicTableMigrationScript
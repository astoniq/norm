import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addNotificationTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table notifications
            (
                tenant_id       varchar(21)  not null
                    references tenants (id) on update cascade on delete cascade,
                id              varchar(21)  not null,
                notification_id varchar(128) not null,
                resource_id     varchar(21)  not null,
                subscriber_id   varchar(21)  not null,
                status          varchar(128) not null,
                payload         jsonb,
                primary key (id)
            );
            create index notifications__id on notifications (tenant_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table notifications;
        `);
    }
}

export default addNotificationTableMigrationScript
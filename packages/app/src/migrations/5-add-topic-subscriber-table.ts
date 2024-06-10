import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table topic_subscribers
            (
                tenant_id     varchar(21) not null
                    references tenants (id) on update cascade on delete cascade,
                id            varchar(21) not null,
                topic_id      varchar(21) not null,
                subscriber_id varchar(21) not null,
                primary key (id)
            );
            create index topic_subscribers__id on topic_subscribers (tenant_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table topic_subscribers;
        `);
    }
}

export default migration
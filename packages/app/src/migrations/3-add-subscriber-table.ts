import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table subscribers
            (
                tenant_id     varchar(21)  not null
                    references tenants (id) on update cascade on delete cascade,
                id            varchar(21)  not null,
                subscriber_id varchar(128) not null,
                name          varchar(256),
                avatar        varchar(2048),
                phone         varchar(128),
                email         varchar(128),
                username      varchar(128),
                locale        varchar(128),
                primary key (id),
                constraint subscribers__subscriber_id unique (tenant_id, subscriber_id)
            );
            create index subscribers__id on subscribers (tenant_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table subscribers;
        `);
    }
}

export default migration
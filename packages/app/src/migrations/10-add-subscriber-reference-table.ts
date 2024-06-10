import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addResourceTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table subscriber_references
            (
                tenant_id     varchar(21)  not null
                    references tenants (id) on update cascade on delete cascade,
                id            varchar(21)  not null,
                subscriber_id varchar(128) not null,
                target        varchar(128) not null,
                credentials   jsonb,
                primary key (id),
                constraint subscriber_references__subscriber_id_target
                    unique (tenant_id, subscriber_id, target)
            );
            create index subscriber_references__id on subscriber_references (tenant_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table subscriber_references;
        `);
    }
}

export default addResourceTableMigrationScript
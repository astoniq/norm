import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addResourceTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table connectors
            (
                tenant_id     varchar(21)  not null
                    references tenants (id) on update cascade on delete cascade,
                id            varchar(21) not null,
                connector_id varchar(128) not null,
                type varchar(128) not null,
                config jsonb not null,
                primary key (id)
            );
            create index connectors__id on connectors (tenant_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table connectors;
        `);
    }
}

export default addResourceTableMigrationScript
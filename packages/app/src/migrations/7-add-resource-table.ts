import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addResourceTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table resources
            (
                tenant_id   varchar(21)  not null
                    references tenants (id) on update cascade on delete cascade,
                id          varchar(21)  not null,
                resource_id varchar(128) not null,
                signing_key varchar(64)  not null,
                enabled     boolean      not null default true,
                config      jsonb,
                primary key (id),
                constraint resources__resource_id unique (tenant_id, resource_id)
            );

            create index resources__id on resources (tenant_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table resources;
        `);
    }
}

export default addResourceTableMigrationScript
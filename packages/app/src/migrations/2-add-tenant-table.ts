import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table tenants
            (
                id         varchar(21)  not null,
                tenant_id  varchar(128) not null,
                client_key varchar(64)  not null,
                primary key (id),
                constraint tenants_tenant__id unique (tenant_id)
            );
            create index tenants__id on tenants (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table tenants;
        `);
    }
}

export default migration
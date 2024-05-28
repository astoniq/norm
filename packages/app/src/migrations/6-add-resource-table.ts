import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addResourceTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table resources
            (
                id            varchar(21) not null,
                resource_id varchar(256) not null,
                signing_key varchar(64) not null,
                config jsonb,
                primary key (id)
            );
            create index resources_id on resources (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table resources;
        `);
    }
}

export default addResourceTableMigrationScript
import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addResourceTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table connectors
            (
                id            varchar(21) not null,
                connector_id varchar(128) not null,
                type varchar(128) not null,
                config jsonb,
                primary key (id)
            );
            create index connectors_id on connectors (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table connectors;
        `);
    }
}

export default addResourceTableMigrationScript
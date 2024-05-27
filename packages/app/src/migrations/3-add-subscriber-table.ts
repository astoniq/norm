import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addSubscriberTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table subscribers
            (
                id            varchar(21)  not null,
                subscriber_id varchar(128) not null,
                email         varchar(128) null,
                primary key (id)
            );
            create index subscribers_id on subscribers (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table subscribers;
        `);
    }
}

export default addSubscriberTableMigrationScript
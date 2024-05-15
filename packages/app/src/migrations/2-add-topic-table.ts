import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addTopicTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table topics
            (
                id          varchar(21)  not null,
                name        varchar(128) not null,
                description varchar(128) not null,
                primary key (id)
            );
            create index topics_id on topics (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table topics;
        `);
    }
}

export default addTopicTableMigrationScript
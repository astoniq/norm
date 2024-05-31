import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const addTopicSubscriberTableMigrationScript: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table topic_subscribers
            (
                id            varchar(21) not null,
                topic_id      varchar(21) not null,
                subscriber_id varchar(128) not null,
                primary key (id)
            );
            create index topic_subscribers_id on topic_subscribers (id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table topic_subscribers;
        `);
    }
}

export default addTopicSubscriberTableMigrationScript
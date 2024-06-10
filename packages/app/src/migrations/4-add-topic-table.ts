import {sql} from "slonik";
import {MigrationScript} from "../types/index.js";

const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table topics
            (
                tenant_id varchar(21)  not null
                    references tenants (id) on update cascade on delete cascade,
                id        varchar(21)  not null,
                topic_id  varchar(128) not null,
                primary key (id),
                constraint topics__topic_id unique (tenant_id, topic_id)
            );
            create index topics__id on topics (tenant_id, id);
        `)
    },
    down: async (pool) => {
        await pool.query(sql.unsafe`
            drop table topics;
        `);
    }
}

export default migration
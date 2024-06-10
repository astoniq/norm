import {Topic} from "@astoniq/norm-schema";
import {Entity} from "../types/index.js";

export const topicEntity: Entity<Topic> =
    Object.freeze({
        table: 'topics',
        tableSingular: 'topic',
        fields: {
            tenantId: 'tenant_id',
            id: 'id',
            topicId: 'topic_id'
        },
    });
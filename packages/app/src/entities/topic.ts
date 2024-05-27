import {Topic} from "@astoniq/norm-schema";
import {Entity} from "../types/index.js";

export const topicEntity: Entity<Topic> =
    Object.freeze({
        table: 'topics',
        tableSingular: 'topic',
        fields: {
            id: 'id',
            name: 'name',
            description: 'description',
        },
    });
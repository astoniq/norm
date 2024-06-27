import {InsertTopic, insertTopicGuard, Topic, topicGuard} from "@astoniq/norm-schema";
import {Entity} from "../types/index.js";

export const topicEntity: Entity<
    Topic,
    InsertTopic
> = {
    table: 'topics',
    tableSingular: 'topic',
    fields: {
        projectId: 'project_id',
        id: 'id',
        topicId: 'topic_id',
        createdAt: 'created_at',
    },
    guard: topicGuard,
    insertGuard: insertTopicGuard
};
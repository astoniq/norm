export interface CreateClientTopic {
    topicId: string;
}

export interface ClientTopic {
    projectId: string,
    id: string,
    topicId: string,
    createdAt: number,
}
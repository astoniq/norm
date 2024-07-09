export interface CreateClientTopic {
    topicId: string;
    subscriberIds?: string[]
}

export interface CreateClientTopicSubscribers {
    topicId: string,
    subscriberIds: string[]
}
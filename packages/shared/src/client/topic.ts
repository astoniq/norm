export interface CreateClientTopic {
    topicId: string;
    subscriberIds?: string[]
}

export interface CreateClientTopicSubscribers {
    topicId: string,
    subscriberIds: string[]
}

export interface RemoveClientTopic {
    topicId: string;
}

export interface RemoveClientTopicSubscribers {
    topicId: string;
    subscriberIds: string[]
}
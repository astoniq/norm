import {Topic, TopicResponse} from "@astoniq/norm-schema";

export type TopicDetailsOutletContext = {
    topic: TopicResponse
    isDeleting: boolean;
    onTopicUpdated: (topic?: Topic) => void
}

export type TopicDetailsFormType = Pick<TopicResponse, 'topicId'>
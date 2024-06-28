import {PatchTopic, TopicResponse} from "@astoniq/norm-schema";
import {TopicDetailsFormType} from "./types.ts";

export const topicDetailsParser = {
    toLocalForm: (data: TopicResponse): TopicDetailsFormType => {

        const {
            topicId
        } = data

        return {
            topicId
        }
    },
    toRemoteModel: (data: TopicDetailsFormType): PatchTopic => {
        const {
            topicId
        } = data

        return {
            topicId
        }
    }
}
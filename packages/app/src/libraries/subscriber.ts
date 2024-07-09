import {Queries} from "../queries/index.js";
import {SubscriberDefine} from "@astoniq/norm-shared";
import {Subscriber} from "@astoniq/norm-schema";
import {generateStandardId} from "../utils/id.js";

export const createSubscriberLibrary = (queries: Queries) => {

    const {
        subscribers,
        subscriberReferences
    } =queries

    const createSubscriber = async (
        projectId: string, subscriberDefine: SubscriberDefine): Promise<Subscriber> => {

        return subscribers.insertSubscriber({
            ...subscriberDefine,
            id: generateStandardId(),
            projectId,
        })
    }

    const updateSubscriber = async (
        projectId: string, subscriberDefine: SubscriberDefine): Promise<Subscriber> => {

        return subscribers.updateSubscriber({
            set: subscriberDefine,
            where: {subscriberId: subscriberDefine.subscriberId, projectId},
            jsonbMode: "merge"
        })
    }

    const getSubscriber = async (
        projectId: string, subscriberDefine: SubscriberDefine): Promise<Subscriber> => {

        const subscriber = await subscribers.hasProjectSubscriberBySubscriberId(
            projectId, subscriberDefine.subscriberId)

        if (subscriber) {
            return updateSubscriber(projectId, subscriberDefine)
        }

        return createSubscriber(projectId, subscriberDefine)
    }

    const updateSubscriberReferences = async (
        projectId: string, subscriber: Subscriber, subscriberDefine: SubscriberDefine) => {

        const {references} = subscriberDefine;

        if (!references) {
            return
        }

        for (const reference of references) {

            await subscriberReferences.upsertSubscriberReference({
                id: generateStandardId(),
                projectId,
                subscriberId: subscriber.id,
                referenceId: reference.referenceId,
                target: reference.target,
                credentials: reference.credentials
            })
        }
    }

    return {
        getSubscriber,
        updateSubscriberReferences
    }
}
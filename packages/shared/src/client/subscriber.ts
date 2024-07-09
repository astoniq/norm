import {SubscriberPayload, SubscriberReferencePayload} from "../types/index.js";

export type CreateClientSubscriber = SubscriberPayload & {
    subscriberId: string;
    references?: SubscriberReferencePayload[]
}

export interface RemoveClientSubscriber {
    subscriberId: string;
}

export type CreateClientSubscriberReferences = {
    subscriberId: string;
    references?: SubscriberReferencePayload[]
}

export type RemoveClientSubscriberReferences = {
    subscriberId: string;
    referenceIds: string[]
}
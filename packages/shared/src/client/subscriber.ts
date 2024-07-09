import {SubscriberPayload, SubscriberReferencePayload} from "../types/index.js";

export type CreateClientSubscriber = SubscriberPayload & {
    subscriberId: string;
    references?: SubscriberReferencePayload[]
}
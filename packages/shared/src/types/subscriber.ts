import {JsonObject} from "./json.js";

export type SubscriberReferencePayload = {
    target: string;
    credentials: JsonObject
}

export type SubscriberPayload = {
    username?: string | null,
    email?: string | null,
    phone?: string | null,
    name?: string | null,
    locale?: string | null,
    avatar?: string | null
    references?: SubscriberReferencePayload[]
}

export type SubscriberDefine = SubscriberPayload & {
    subscriberId: string;
}
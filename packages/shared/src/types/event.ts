import {JsonObject} from "./json.js";
import {SubscriberDefine} from "./subscriber.js";

export enum TriggerRecipientsType {
    Subscriber = 'subscriber',
    Topic = 'topic'
}

export enum TriggerAddressingType {
    Broadcast = 'broadcast',
    Multicast = 'multicast'
}

export type TriggerPayload = JsonObject

export interface TriggerEventBase {
    resourceId: string;
    workflowId: string;
    payload: TriggerPayload
}

export type TriggerRecipientTopic = {
    type: TriggerRecipientsType.Topic,
    recipient: string
}

export type TriggerRecipientSubscriber = {
    type: TriggerRecipientsType.Subscriber,
    recipient: string | SubscriberDefine
}

export type TriggerRecipient = TriggerRecipientTopic | TriggerRecipientSubscriber

export type TriggerEventBroadcast = {
    type: TriggerAddressingType.Broadcast
} & TriggerEventBase

export type TriggerRecipientsPayload = TriggerRecipient | TriggerRecipient[]

export type TriggerEventMulticast = {
    type: TriggerAddressingType.Multicast,
    to: TriggerRecipientsPayload
} & TriggerEventBase

export type TriggerEvent = TriggerEventBroadcast | TriggerEventMulticast;
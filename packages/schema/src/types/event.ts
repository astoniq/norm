import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";
import {subscriberDefineGuard} from "./subscriber.js";

export enum TriggerEventStatus {
    Error = 'error',
    Processed = 'processed',
}

export enum TriggerRecipientsType {
    Subscriber = 'subscriber',
    Topic = 'topic'
}

export enum AddressingType {
    Broadcast = 'broadcast',
    Multicast = 'multicast'
}

export const triggerEventBaseGuard = {
    resourceId: z.string().min(1),
    workflowId: z.string().min(1),
    payload: jsonObjectGuard
}

export const triggerRecipientTopic = z.object({
    type: z.literal(TriggerRecipientsType.Topic),
    recipient: z.string()
})

export type TriggerRecipientTopic = z.infer<typeof triggerRecipientTopic>

export const triggerRecipientSubscriber = z.object({
    type: z.literal(TriggerRecipientsType.Subscriber),
    recipient: z.union([z.string(), subscriberDefineGuard])
})

export type TriggerRecipientSubscriber = z.infer<typeof triggerRecipientSubscriber>

export const triggerRecipientGuard = z.discriminatedUnion('type', [
    triggerRecipientTopic,
    triggerRecipientSubscriber
])

export type TriggerRecipient = z.infer<typeof triggerRecipientGuard>;

export const triggerRecipientsPayloadGuard =
    z.union([z.array(triggerRecipientGuard), triggerRecipientGuard])

export const triggerEventMulticastGuard = z.object({
    type: z.literal(AddressingType.Multicast),
    to: triggerRecipientsPayloadGuard,
    ...triggerEventBaseGuard
})

export type TriggerEventMulticast = z.infer<typeof triggerEventMulticastGuard>

export const triggerEventBroadcastGuard = z.object({
    type: z.literal(AddressingType.Broadcast),
    ...triggerEventBaseGuard
})

export type TriggerEventBroadcast = z.infer<typeof triggerEventBroadcastGuard>

export const triggerEventGuard = z.discriminatedUnion('type', [
    triggerEventMulticastGuard,
    triggerEventBroadcastGuard
])

export type TriggerEvent = z.infer<typeof triggerEventGuard>
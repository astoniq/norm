import {z, ZodType} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";
import {subscriberDefineGuard} from "./subscriber.js";
import {
    TriggerAddressingType,
    TriggerEvent,
    TriggerEventBase,
    TriggerEventBroadcast,
    TriggerEventMulticast,
    TriggerRecipient,
    TriggerRecipientsPayload,
    TriggerRecipientsType,
    TriggerRecipientSubscriber,
    TriggerRecipientTopic
} from "@astoniq/norm-shared";

export const triggerEventBaseGuard = z.object({
    resourceId: z.string().min(1),
    notificationId: z.string().min(1),
    payload: jsonObjectGuard,
    actor: z.string().array().optional()
})  satisfies ZodType<TriggerEventBase>

export const triggerRecipientTopicGuard = z.object({
    type: z.literal(TriggerRecipientsType.Topic),
    recipient: z.string()
}) satisfies ZodType<TriggerRecipientTopic>

export const triggerRecipientSubscriberGuard = z.object({
    type: z.literal(TriggerRecipientsType.Subscriber),
    recipient: z.union([z.string(), subscriberDefineGuard])
}) satisfies ZodType<TriggerRecipientSubscriber>

export const triggerRecipientGuard: z.ZodType<TriggerRecipient> = z.discriminatedUnion(
    'type',
    [
        triggerRecipientTopicGuard,
        triggerRecipientSubscriberGuard
    ])

export const triggerRecipientsPayloadGuard: z.ZodType<TriggerRecipientsPayload> =
    z.union([z.array(triggerRecipientGuard), triggerRecipientGuard])

export const triggerEventMulticastGuard = z.object({
    type: z.literal(TriggerAddressingType.Multicast),
    to: triggerRecipientsPayloadGuard
}).merge(triggerEventBaseGuard) satisfies ZodType<TriggerEventMulticast>

export const triggerEventBroadcastGuard = z.object({
    type: z.literal(TriggerAddressingType.Broadcast)
}).merge(triggerEventBaseGuard) satisfies ZodType<TriggerEventBroadcast>

export const triggerEventGuard = z.discriminatedUnion('type', [
    triggerEventMulticastGuard,
    triggerEventBroadcastGuard
])  satisfies ZodType<TriggerEvent>

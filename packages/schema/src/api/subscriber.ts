import {subscriberGuard} from "../db/index.js";
import {z} from "zod";
import {createPaginationResponseGuard} from "../types/index.js";

export const subscriberResponseGuard = subscriberGuard;

export type SubscriberResponse = z.infer<typeof subscriberResponseGuard>;

export const subscriberPaginationResponseGuard = createPaginationResponseGuard(subscriberResponseGuard)

export type SubscriberPaginationResponse = z.infer<typeof subscriberPaginationResponseGuard>

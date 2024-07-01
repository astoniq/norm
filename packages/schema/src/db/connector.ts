import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export const connectorGuard = z.object({
    projectId: z.string().max(21),
    id: z.string().min(1).max(21),
    connectorId: z.string().min(1).max(128),
    name: z.string().min(1).max(128),
    config: jsonObjectGuard,
    createdAt: z.number(),
});

export type Connector = z.infer<typeof connectorGuard>;

export const insertConnectorGuard = connectorGuard;

export type InsertConnector = z.infer<typeof insertConnectorGuard>
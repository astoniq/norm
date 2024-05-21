import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export const createConnectorGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1),
    config: jsonObjectGuard
});

export type CreateConnector = z.infer<typeof createConnectorGuard>;

export const connectorGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1),
    config: jsonObjectGuard
});

export type Connector = z.infer<typeof connectorGuard>;
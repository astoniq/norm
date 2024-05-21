import {z} from "zod";
import {jsonObjectGuard} from "../foundations/index.js";

export enum JobTopic {
    Workflow = 'workflow',
    Subscriber = 'subscriber',
    Message = 'message',
    Echo = 'echo'
}

export const workflowJob = z.object({
    name: z.string().min(1),
    to: z.array(z.string()),
    payload: jsonObjectGuard
})

export type WorkflowJob = z.infer<typeof workflowJob>
import {Echo} from "@astoniq/norm-sdk";
import {z} from "zod";


export const client = new Echo({
    backendUrl: "",
    apiKey: ''
})

await client.workflow('hello', async ({step, payload}) => {

    await step.email('send-email', async () => {
        return {
            subject: 'Send Email',
            body: `hello message ${payload.username}`
        }
    })

}, {
    payloadSchema: z.object({
        username: z.string()
    })
})
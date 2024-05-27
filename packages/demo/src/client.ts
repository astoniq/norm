import {Echo} from "@astoniq/norm-sdk";


export const client = new Echo({
    backendUrl: "",
    apiKey: ''
})

await client.workflow('hello', async ({step}) => {

    await step.email('send-email', async () => {
        return {
            subject: 'This is an email subject',
            body: 'hello message'
        }
    })
}, {payloadSchema: {type: 'object', properties: {}}})
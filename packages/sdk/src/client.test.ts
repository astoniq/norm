import {expect, describe, beforeEach, it} from 'vitest'
import {Echo} from "./client.js";
import {z} from "zod";

describe('client', () => {

    let echo: Echo;

    beforeEach(() => {
        echo = new Echo({
            apiKey: "",
            backendUrl: ""
        });

        echo.workflow('in-app-test-something-1', async ({ step, payload }) => {
            await step.email('send-email', async () => ({
                body: 'Test Body',
                subject: payload.name,
            }));
        }, {
            payloadSchema: z.object({
                name: z.string()
            }),
        });
    });

    it('should discover 1 workflow', () => {
        const workflows = echo.getRegisteredWorkflows();
        expect(workflows).toHaveLength(1);
    });

    it('should run workflow', async () => {
        const {output} = await echo.executeWorkflow({
            workflowId: 'in-app-test-something-1',
            subscriber: {
                subscriberId: "1"
            },
            state: [],
            payload: {}
        });

        expect(output).toEqual({
            body: 'Test Body',
            subject: 'Team Awesome'})
    });

    describe('type tests', () => {
        it('should not compile when the channel output is incorrect', async () => {
           await echo.workflow('email-test', async ({ step }) => {
                // @ts-expect-error - email subject is missing from the output
                await step.email('send-email', async () => ({
                    body: 'Test Body',
                }));
            });
        });

        it('should discover a complex workflow with all supported step types', () => {
            echo.workflow('complex-workflow', async ({ step }) => {
                await step.email('send-email', async () => ({
                    body: 'Test Body',
                    subject: 'Subject',
                }));


                await step.chat('send-chat', async () => ({
                    body: 'Test Body',
                }));

                await step.push('send-push', async () => ({
                    body: 'Test Body',
                    subject: 'Title',
                }));


                await step.sms('send-sms', async () => ({
                    body: 'Test Body',
                    to: '+1234567890',
                }));
            });
        });
    })
})
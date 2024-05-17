import {expect, describe, beforeEach, it} from 'vitest'
import {Echo} from "./client.js";

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
                subject: payload.teamName,
            }));
        }, {
            payloadSchema: {
                type: "object",
                properties: {
                    showJoinButton: { type: "boolean", default: true },
                    username: { type: "string", default: "alanturing" },
                    userImage: {
                        type: "string",
                        default:
                            "https://react-email-demo-bdj5iju9r-resend.vercel.app/static/vercel-user.png",
                        format: "uri",
                    },
                    invitedByUsername: { type: "string", default: "Alan" },
                    invitedByEmail: {
                        type: "string",
                        default: "alan.turing@example.com",
                        format: "email",
                    },
                    teamName: { type: "string", default: "Team Awesome" },
                    teamImage: {
                        type: "string",
                        default:
                            "https://react-email-demo-bdj5iju9r-resend.vercel.app/static/vercel-team.png",
                        format: "uri",
                    },
                    inviteLink: {
                        type: "string",
                        default: "https://vercel.com/teams/invite/foo",
                        format: "uri",
                    },
                    inviteFromIp: { type: "string", default: "204.13.186.218" },
                    inviteFromLocation: {
                        type: "string",
                        default: "São Paulo, Brazil",
                    },
                },
                additionalProperties: false
            },
        });
    });

    it('should discover 1 workflow', () => {
        const workflows = echo.getRegisteredWorkflows();
        expect(workflows).toHaveLength(1);
    });

    it('should run workflow', async () => {
        const {outputs} = await echo.executeWorkflow({
            workflowId: 'in-app-test-something-1',
            stepId: 'send-email',
            action: 'execute',
            subscriber: {},
            inputs: {},
            state: [],
            data: {}
        });

        expect(outputs).toEqual({
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
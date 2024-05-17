import {MaybePromise} from "./types/index.js";
import {Echo} from "./client.js";
import {
    GetActionType,
    HttpHeaderKeysType,
    HttpMethodType,
    HttpQueryKeysType,
    HttpStatusType
} from "./constants/index.js";
import {EchoError, InvalidActionError, MethodNotAllowedError, PlatformError} from "./errors/index.js";
import {PostActionType} from "./constants/action.js";

export interface ActionResponse<Body extends string = string> {
    status: number;
    headers: Record<string, string>;
    body: Body
}

export type HandlerResponse<Output = any> = {
    body: () => MaybePromise<any>,
    headers: (key: string) => MaybePromise<string | null | undefined>,
    method: () => MaybePromise<string>,
    url: () => MaybePromise<URL>,
    queryString: (key: string, url: URL) => MaybePromise<string | null | undefined>,
    transformResponse: (res: ActionResponse) => Output
}

export type Handler<Input extends any[] = any[], Output = any> = (...args: Input) => HandlerResponse<Output>

export interface EchoRequestHandlerOptions<Input extends any[] = any[], Output = any> {
    client: Echo;
    handler: Handler<Input, Output>
}

export class EchoRequestHandler<Input extends any[] = any[], Output = any> {

    readonly handler: Handler

    readonly client: Echo

    constructor({handler, client}: EchoRequestHandlerOptions) {
        this.handler = handler;
        this.client = client
    }

    public createHandler(): (...args: Input) => Promise<Output> {
        return async (...args: Input) => {
            const request =  this.handler(...args);
            const response = await this.handleRequest(request);
            return request.transformResponse(response);
        };
    }

    private getStaticHeaders(): Partial<Record<HttpHeaderKeysType, string>> {
        return {
            [HttpHeaderKeysType.CONTENT_TYPE]: 'application/json',
            [HttpHeaderKeysType.ACCESS_CONTROL_ALLOW_ORIGIN]: '*',
            [HttpHeaderKeysType.ACCESS_CONTROL_ALLOW_METHODS]: 'GET, POST',
            [HttpHeaderKeysType.ACCESS_CONTROL_ALLOW_HEADERS]: '*',
        };
    }

    private createResponse<TBody extends string = string>(
        status: number,
        body: any,
        headers: Record<string, string> = {}
    ): ActionResponse<TBody> {
        return {
            status,
            body: JSON.stringify(body) as TBody,
            headers: {
                ...this.getStaticHeaders(),
                ...headers,
            },
        };
    }

    private createError<TBody extends string = string>(error: EchoError): ActionResponse<TBody> {
        return {
            status: error.statusCode,
            body: JSON.stringify({
                message: error.message,
                data: error.data,
                code: error.code,
            }) as TBody,
            headers: this.getStaticHeaders(),
        };
    }

    private async handleRequest(request: HandlerResponse<Output>): Promise<ActionResponse> {
        const method = await request.method()
        const url = await request.url()
        const action = url.searchParams.get(HttpQueryKeysType.ACTION) || '';
        const workflowId = url.searchParams.get(HttpQueryKeysType.WORKFLOW_ID) || '';
        const stepId = url.searchParams.get(HttpQueryKeysType.STEP_ID) || '';

        let body: Record<string, unknown> = {};

        try {
            if (method === HttpMethodType.POST) {
                body = await request.body()
            }
        } catch  {
            // noop
        }

        try {
            const postActionMap = this.getPostActionMap(body, workflowId, stepId, action);
            const getActionMap = this.getGetActionMap();

            if (method === HttpMethodType.POST) {
                return await this.handlePostAction(action, postActionMap);
            }

            if (method === HttpMethodType.GET) {
                return await this.handleGetAction(action, getActionMap);
            }
        }
        catch (error) {
            return this.handleError(error);
        }

        return this.createError(new MethodNotAllowedError(method));
    }

    private async handleGetAction(
        action: string,
        getActionMap: Record<GetActionType, () => Promise<ActionResponse>>
    ): Promise<ActionResponse> {
        if (Object.values(GetActionType).includes(action as GetActionType)) {
            const actionFunction = getActionMap[action as GetActionType];

            return actionFunction();
        } else {
            throw new InvalidActionError(action, GetActionType);
        }
    }

    private async handlePostAction(
        action: string,
        postActionMap: Record<PostActionType, () => Promise<ActionResponse>>
    ): Promise<ActionResponse> {
        if (Object.values(PostActionType).includes(action as PostActionType)) {
            const actionFunction = postActionMap[action as PostActionType];

            return actionFunction();
        } else {
            throw new InvalidActionError(action, PostActionType);
        }
    }

    private handleError(error: any): ActionResponse {
        if (error instanceof EchoError) {
            return this.createError(error);
        } else {
            return this.createError(new PlatformError());
        }
    }

    private getPostActionMap(
        body: any,
        workflowId: string,
        stepId: string,
        action: string
    ): Record<PostActionType, () => Promise<ActionResponse>> {
        return {
            [PostActionType.EXECUTE]: async () => {
                const result = await this.client.executeWorkflow({
                    ...body,
                    workflowId,
                    stepId,
                    action,
                });

                return this.createResponse(HttpStatusType.OK, result, {
                    [HttpHeaderKeysType.EXECUTION_DURATION]: result.metadata.duration.toString(),
                });
            },
            [PostActionType.PREVIEW]: async () => {
                const result = await this.client.executeWorkflow({
                    ...body,
                    workflowId,
                    stepId,
                    action,
                });

                return this.createResponse(HttpStatusType.OK, result, {
                    [HttpHeaderKeysType.EXECUTION_DURATION]: result.metadata.duration.toString(),
                });
            },

        };
    }

    private getGetActionMap(): Record<GetActionType, () => Promise<ActionResponse>> {
        return {
            [GetActionType.DISCOVER]: async () => {
                const result =  this.client.getRegisteredWorkflows();

                return this.createResponse(HttpStatusType.OK, result);
            },
            [GetActionType.HEALTH_CHECK]: async () => {
                const result =  this.client.healthCheck();

                return this.createResponse(HttpStatusType.OK, result);
            },
        };
    }

}
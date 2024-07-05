import {NormConfig} from "../types/index.js";
import {isNormErrorResponse, NormError} from "./error.js";
import {TriggerEvent} from "@astoniq/norm-shared";
import {Topics} from "../core/topic.js";

export class Norm {

    private readonly headers: Headers;
    private readonly baseUrl: string;

    readonly topics = new Topics(this)

    constructor(config: NormConfig) {

        this.headers = new Headers({
            Authorization: `ClientKey ${config.clientKey}`,
            'Content-Type': 'application/json',
        });

        this.baseUrl = config.baseUrl;
    }

    async fetchRequest<T>(
        path: string,
        options = {},
    ): Promise<T> {

        try {
            const response = await fetch(`${this.baseUrl}/${path}`, options);

            const data = await response.json();

            if (!response.ok) {
                if (isNormErrorResponse(data)) {
                    throw NormError.fromResponse(data)
                }
                throw new NormError('application_error', response.statusText)
            }

            return data as T

        } catch (error) {

            if (error instanceof NormError) {
                throw error
            }

            if (error instanceof SyntaxError) {
                throw new NormError('application_error',
                    'Internal server error. We are unable to process your request right now.')
            }

            if (error instanceof Error) {
                throw new NormError('application_error', error.message)
            }

            throw new NormError('application_error',
                'Unable to fetch data. The request could not be resolved.')
        }
    }

    async post<T>(path: string, data?: unknown) {
        const requestOptions = {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        };

        return this.fetchRequest<T>(path, requestOptions);
    }

    async get<T>(path: string) {
        const requestOptions = {
            method: 'GET',
            headers: this.headers,
        };

        return this.fetchRequest<T>(path, requestOptions);
    }

    async put<T>(path: string, entity: unknown) {
        const requestOptions = {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(entity),
        };

        return this.fetchRequest<T>(path, requestOptions);
    }

    async patch<T>(path: string, entity: unknown) {
        const requestOptions = {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(entity)
        };

        return this.fetchRequest<T>(path, requestOptions);
    }

    async delete<T>(path: string, query?: unknown) {
        const requestOptions = {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify(query),
        };

        return this.fetchRequest<T>(path, requestOptions);
    }

    async trigger(event: TriggerEvent): Promise<void> {
        return this.post('events', event)
    }
}


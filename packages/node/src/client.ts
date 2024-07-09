import {NormConfig} from "./types.js";
import {isNormErrorResponse, NormError} from "./error.js";
import {
    TriggerEvent,
    CreateClientSubscriber,
    CreateClientTopic,
    CreateClientTopicSubscribers,
    RemoveClientTopic,
    RemoveClientSubscriber,
    RemoveClientTopicSubscribers,
    CreateClientSubscriberReferences, RemoveClientSubscriberReferences
} from "@astoniq/norm-shared";

export class Norm {

    private readonly headers: Headers;
    private readonly baseUrl: string;

    constructor(config: NormConfig) {

        this.headers = new Headers({
            Authorization: `ClientKey ${config.clientKey}`,
            'Content-Type': 'application/json',
            Accept: "application/json"
        });

        this.baseUrl = config.baseUrl;
    }

    async trigger(event: TriggerEvent): Promise<void> {
        return this.post('trigger', event)
    }

    async createSubscriber(data: CreateClientSubscriber): Promise<void> {
        return this.post('createSubscriber', data)
    }

    async createTopic(data: CreateClientTopic): Promise<void> {
        return this.post('createTopic', data)
    }

    async removeSubscriber(data: RemoveClientSubscriber): Promise<void> {
        return this.delete('removeSubscriber', data)
    }

    async removeTopic(data: RemoveClientTopic): Promise<void> {
        return this.post('removeTopic', data)
    }

    async addSubscriberReferences(data: CreateClientSubscriberReferences): Promise<void> {
        return this.post('addSubscriberReferences', data)
    }

    async addTopicSubscribers(data: CreateClientTopicSubscribers): Promise<void> {
        return this.post('addTopicSubscribers', data)
    }

    async removeSubscriberReferences(data: RemoveClientSubscriberReferences): Promise<void> {
        return this.post('removeSubscriberReferences', data)
    }

    async removeTopicSubscribers(data: RemoveClientTopicSubscribers): Promise<void> {
        return this.post('removeTopicSubscribers', data)
    }

    async fetchRequest<T>(
        path: string,
        options = {},
    ): Promise<T> {

        try {
            const response = await fetch(`${this.baseUrl}/${path}`, options);

            const contentType = response.headers.get('content-type');

            const isJson = contentType
                && contentType?.includes('application/json');

            const data = isJson ? await response.json() : null;

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
}


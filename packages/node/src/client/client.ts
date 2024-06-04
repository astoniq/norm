import {NormConfig} from "../types/index.js";
import axios, {AxiosInstance} from "axios";
import {makeRetryable} from "./retry.js";
import {TriggerEvent} from "@astoniq/norm-shared";

export class NormClient {

    private readonly http: AxiosInstance;
    constructor(config: NormConfig) {

        const axiosInstance = axios.create({
            baseURL: config.backendUrl + '/client',
            headers: {
                Authorization: `ClientKey ${config.clientKey}`
            }
        })

        if (config?.retryConfig) {
            makeRetryable(axiosInstance, config)
        }

        this.http = axiosInstance
    }

    async trigger(event: TriggerEvent) {
        return this.http.post('/events/trigger', event)
    }

    async bulk(events: TriggerEvent[]) {
        return this.http.post('/events/trigger/bulk', events)
    }

}
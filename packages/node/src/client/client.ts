import {NormConfig} from "../types/index.js";
import axios, {AxiosInstance} from "axios";
import {TriggerEvent} from "@astoniq/norm-shared";

export class NormClient {

    private readonly http: AxiosInstance;
    constructor(config: NormConfig) {

        this.http = axios.create({
            baseURL: config.backendUrl + '/client',
            headers: {
                Authorization: `ClientKey ${config.clientKey}`
            }
        })
    }

    async trigger(event: TriggerEvent) {
        return this.http.post('/events/trigger', event)
    }

    async bulk(events: TriggerEvent[]) {
        return this.http.post('/events/trigger/bulk', events)
    }

}
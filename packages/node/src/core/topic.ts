import {Norm} from "../client/index.js";
import {ClientTopic, CreateClientTopic} from "@astoniq/norm-shared";

export class Topics {

    constructor(private readonly norm: Norm) {}

    async create(topic: CreateClientTopic) {
        return this.norm.post<ClientTopic>('topics', topic)
    }
}
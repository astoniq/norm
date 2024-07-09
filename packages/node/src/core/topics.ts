import {Norm} from "../client/index.js";
import {CreateClientTopic, CreateClientTopicSubscribers} from "@astoniq/norm-shared";

export class Topics {

    constructor(private readonly norm: Norm) {
    }

    async create(data: CreateClientTopic): Promise<void> {
        return this.norm.post('topics', data)
    }

    async remove() {

    }

    async addSubscribers(data: CreateClientTopicSubscribers): Promise<void> {
        return this.norm.post('topics/subscribers', data)
    }

    async removeSubscribers() {

    }
}
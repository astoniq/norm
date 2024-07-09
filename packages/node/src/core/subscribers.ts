import {Norm} from "../client/index.js";
import {CreateClientSubscriber, CreateClientTopicSubscribers} from "@astoniq/norm-shared";

export class Subscribers {

    constructor(private readonly norm: Norm) {
    }

    async create(data: CreateClientSubscriber): Promise<void> {
        return this.norm.post('subscribers', data)
    }

    async remove() {

    }

    async addReference(data: CreateClientTopicSubscribers): Promise<void> {
        return this.norm.post('topics/subscribers', data)
    }

    async removeReference() {

    }
}
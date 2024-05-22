import {CommonQueryMethods} from "slonik";
import {buildFindAllEntitiesWithPool} from "../database/index.js";
import {subscriberEntity} from "../entities/index.js";
import {subscriberGuard} from "@astoniq/norm-schema";

export const createSubscriberQueries = (pool: CommonQueryMethods) => {

    const findAllSubscribers = buildFindAllEntitiesWithPool(pool)(
        subscriberEntity, subscriberGuard
    )

    return {
        findAllSubscribers
    }
}
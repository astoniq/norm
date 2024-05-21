import {CommonQueryMethods} from "slonik";
import {createNotificationQueries} from "./notification.js";

export type Queries = ReturnType<typeof createQueries>

export const createQueries = (pool: CommonQueryMethods) => {

    const notification = createNotificationQueries(pool)

    return {
        notification
    }
}
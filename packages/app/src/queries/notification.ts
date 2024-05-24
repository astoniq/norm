import {CommonQueryMethods} from "slonik";
import {notificationEntity} from "../entities/index.js";
import {buildInsertIntoWithPool} from "../database/index.js";
import {notificationGuard} from "@astoniq/norm-schema";

export const createNotificationQueries = (pool: CommonQueryMethods) => {

    const insertNotification = buildInsertIntoWithPool(pool)(
        notificationEntity, notificationGuard, {returning: true})

    return {
        insertNotification,
        pool
    }
}
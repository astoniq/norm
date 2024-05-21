import {logger} from "../utils/logger.js";
import {Redis} from "ioredis";

export const createRedis = (url: string): Redis => {

    const client = new Redis(url)

    client.on("connect", () => {
        logger.info("Redis connected")
    })
    client.on("error", (err: any) => {
        logger.error("Redis error", err)
    })
    client.on("reconnecting", () => {
        logger.info("Redis reconnecting")
    })

    return client
}
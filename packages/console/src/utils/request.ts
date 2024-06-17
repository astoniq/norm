import {RequestError} from "../hooks/use-api.ts";

type Options = {
    ignore: number[]
}

export const shouldRetryOnError = (options?: Options) => {
    return (error: unknown): boolean => {
        if (error instanceof RequestError) {
            const {status} = error
            const {ignore} = options ?? {}

            return !ignore?.includes(status)
        }

        return true
    }
}
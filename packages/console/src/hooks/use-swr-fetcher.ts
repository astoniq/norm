import {HTTPError, KyInstance} from "ky";
import {Fetcher} from "swr";
import {useCallback} from "react";
import {RequestError} from "./use-api.ts";


export type WithTotalNumber<T> = Array<Awaited<T> | number>;

export type UseSwrFetcherHook = {
    <T>(api: KyInstance): Fetcher<T>
    <T extends unknown[]>(api: KyInstance): Fetcher<WithTotalNumber<T>>
}

export const useSwrFetcher: UseSwrFetcherHook = <T>(api: KyInstance) => {

    return useCallback<Fetcher<T | WithTotalNumber<T>>>(
        async (resource: string) => {
            try {
                return api.get(resource).json<T>();
            } catch (error) {
                if (error instanceof HTTPError) {
                    const {response} = error;
                    throw new RequestError(response.status, await response.clone().json());
                }
                throw error;
            }
        }, [api]
    )
}
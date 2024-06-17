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
                const response = await api.get(resource);

                const data = await response.json<T>();

                if (resource.includes('?')) {
                    const parameters = new URLSearchParams(resource.split('?')[1]);

                    if (parameters.get('page') && parameters.get('page_size')) {
                        const number = response.headers.get('Total-Number') ?? 0;

                        return [data, Number(number)];
                    }
                }
                return data;

            } catch (error) {
                console.log(error)
                if (error instanceof HTTPError) {
                    const {response} = error;
                    throw new RequestError(response.status, await response.clone().json());
                }
                throw error;
            }
        }, [api]
    )
}
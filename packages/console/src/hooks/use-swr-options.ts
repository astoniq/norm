import {KyInstance} from "ky";
import {useMemo} from "react";
import {SWRConfiguration} from "swr";
import {useSwrFetcher} from "./use-swr-fetcher.ts";
import {shouldRetryOnError} from "../utils";


export const useSwrOptions = (api: KyInstance): SWRConfiguration => {

    const fetcher = useSwrFetcher(api)

    return useMemo(
        () => ({
            fetcher,
            shouldRetryOnError: shouldRetryOnError({ignore: [401, 403]})
        }), [fetcher]
    )
}
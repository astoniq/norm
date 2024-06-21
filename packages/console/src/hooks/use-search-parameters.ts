import {useSearchParams} from "react-router-dom";
import {useCallback} from "react";
import {conditional} from "@astoniq/essentials";

type SearchParameters = Record<string, string | number>;

type UseSearchParametersReturn<T extends SearchParameters = SearchParameters> = [
    {
        [K in keyof T]: T[K]
    },
    (parameters: Partial<T>) => void
]

export const useSearchParameters = <T extends SearchParameters>(
    config: T
): UseSearchParametersReturn<T> => {

    const [searchParameters, setSearchParameters] = useSearchParams()

    const updateSearchParameters = useCallback(
        (parameters: Partial<T>) => {
            const baseParameters = new URLSearchParams(searchParameters);

            for (const key of Object.keys(parameters)) {
                const value = parameters[key as keyof Partial<T>];

                if (value === undefined) {
                    baseParameters.delete(key)
                } else {
                    baseParameters.set(key, String(value))
                }
            }

            setSearchParameters(baseParameters)

        }, [searchParameters, setSearchParameters]
    )

    return [
        Object.fromEntries(
            Object.entries(config).map(([parameterKey, defaultValue]) => {
                const locationParameterValue = searchParameters.get(parameterKey);
                const parameterValue = typeof defaultValue === 'string'
                    ? locationParameterValue ?? defaultValue
                    : conditional(locationParameterValue && Number(locationParameterValue)) ?? defaultValue
                return [parameterKey, parameterValue]
            })
        ) as UseSearchParametersReturn<T>[0],
        updateSearchParameters]
}
import {useEffect, useState} from "react";

export const useCacheValue = <T>(value:T) => {
    const [cachedValue, setCachedValue] =useState<T>();

    useEffect(() => {
        if (value !== undefined) {
            setCachedValue(value)
        }
    }, [value]);

    return cachedValue
}
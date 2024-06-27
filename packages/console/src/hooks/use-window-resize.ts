import { useEffect, useLayoutEffect, useRef } from 'react';

type Callback = (event?: UIEvent) => void;

export const useWindowResize = (callback: Callback) => {
    const callbackRef = useRef<Callback>(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useLayoutEffect(() => {
        const handler: Callback = (event) => {
            callbackRef.current(event);
        };

        handler();
        window.addEventListener('resize', handler);

        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);
};
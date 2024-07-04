import {matchPath, NavigateFunction, NavigateOptions, To, useHref, useLocation, useNavigate} from "react-router-dom";
import {useCallback, useContext, useMemo} from "react";
import {ProjectContext} from "../providers/ProjectProvider";
import {appendPath, joinPath} from "@astoniq/essentials";

export type ProjectPathname = {
    match: (pathname: string, exact?: boolean) => boolean;
    getPathname: (pathname: string) => string;
    getTo: (to: To) => To;
    navigate: NavigateFunction;
    getUrl: (pathname: string) => URL;
}

export function useProjectPathname(): ProjectPathname {

    const location = useLocation()

    const {currentProjectId} = useContext(ProjectContext);

    const navigate = useNavigate();
    const href = useHref('/');

    const match = useCallback(
        (pathname: string, exact = false) => {
            if (!pathname.startsWith('/')) {
                return (
                    matchPath(joinPath(location.pathname, pathname, exact ? '' : '*'), location.pathname) !==
                    null
                );
            }

            return (
                matchPath(joinPath('projects', ':projectId', pathname, exact ? '' : '*'), location.pathname) !== null
            );
        },
        [location.pathname]
    );

    const getPathname = useCallback(
        (pathname: string) => {
            if (pathname.startsWith('/')) {
                return joinPath('projects', currentProjectId, pathname);
            }
            // Directly return the pathname if it's a relative pathname
            return pathname;
        },
        [currentProjectId]
    );

    const getTo = useCallback(
        (to: To): To => {
            if (typeof to === 'string') {
                return getPathname(to);
            }
            return { ...to, pathname: getPathname(to.pathname ?? '') };
        },
        [getPathname]
    );

    const getUrl = useCallback(
        (pathname = '/') => appendPath(new URL(window.location.origin), href, currentProjectId, pathname),
        [href, currentProjectId]
    );

    return useMemo(
        () => ({
            match,
            navigate: (to: To | number, options?: NavigateOptions) => {
                // Navigate to the given index in the history stack
                if (typeof to === 'number') {
                    navigate(to);
                    return;
                }

                navigate(getTo(to), options);
            },
            getPathname,
            getTo,
            getUrl,
        }),
        [match, getPathname, getTo, navigate, getUrl]
    );
}
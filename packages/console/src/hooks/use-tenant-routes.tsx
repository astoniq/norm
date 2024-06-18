import {useMemo} from "react";
import {conditionalArray} from "@astoniq/essentials";
import {RouteObject} from "react-router-dom";
import {Resources} from "../pages/Resources";

export const useTenantRoutes = () => {

    return useMemo(
        () => conditionalArray<RouteObject | RouteObject[]>(
            {
                path: 'resources',
                children: [
                    {index: true, element: <Resources/>},
                    {path: 'create', element: <Resources/>}
                ]
            }
        ), []
    )
}
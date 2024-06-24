import {useMemo} from "react";
import {conditionalArray} from "@astoniq/essentials";
import {Navigate, RouteObject} from "react-router-dom";
import {Resources} from "../pages/Resources";
import {ResourceDetails} from "../pages/ResourceDetails";
import {ResourceDetailsTabs} from "../constants";
import {ResourceSettings} from "../pages/ResourceDetails/ResourceSettings";

export const useProjectRoutes = () => {

    return useMemo(
        () => conditionalArray<RouteObject | RouteObject[]>(
            {
                path: 'resources',
                children: [
                    {index: true, element: <Resources/>},
                    {path: 'create', element: <Resources/>},
                    {
                        path: ':id',
                        element: <ResourceDetails/>,
                        children: [
                            {index: true, element: <Navigate replace={true} to={ResourceDetailsTabs.Settings}/>},
                            {path: ResourceDetailsTabs.Settings, element: <ResourceSettings/>}
                        ]
                    }
                ]
            }
        ), []
    )
}
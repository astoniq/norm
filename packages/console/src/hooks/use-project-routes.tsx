import {useMemo} from "react";
import {conditionalArray} from "@astoniq/essentials";
import {Navigate, RouteObject} from "react-router-dom";
import {Resources} from "../pages/Resources";
import {ResourceDetails} from "../pages/ResourceDetails";
import {ConnectorDetailsTabs, ResourceDetailsTabs, TopicDetailsTabs} from "../constants";
import {ResourceSettings} from "../pages/ResourceDetails/ResourceSettings";
import {ResourceSecurity} from "../pages/ResourceDetails/ResourceSecurity";
import {Dashboard} from "../pages/Dashboard";
import {Topics} from "../pages/Topics";
import {TopicDetails} from "../pages/TopicDetails";
import {TopicSettings} from "../pages/TopicDetails/TopicSettings";
import {Connectors} from "../pages/Connectors";
import {ConnectorDetails} from "../pages/ConnectorDetails";
import {ConnectorSettings} from "../pages/ConnectorDetails/ConnectorSettings";
import {ConnectorConfiguration} from "../pages/ConnectorDetails/ConnectorConfiguration";
import {Subscribers} from "../pages/Subscribers";
import {Settings} from "../pages/Settings";
import {Notifications} from "../pages/Notifications";

export const useProjectRoutes = () => {

    return useMemo(
        () => conditionalArray<RouteObject | RouteObject[]>(
            [
                {index: true, element: <Navigate replace={true} to={'dashboard'}/>},
                {path: 'dashboard', element: <Dashboard/>},
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
                                {path: ResourceDetailsTabs.Settings, element: <ResourceSettings/>},
                                {path: ResourceDetailsTabs.Security, element: <ResourceSecurity/>}
                            ]
                        }
                    ]
                },
                {
                    path: 'topics',
                    children: [
                        {index: true, element: <Topics/>},
                        {path: 'create', element: <Topics/>},
                        {
                            path: ':id',
                            element: <TopicDetails/>,
                            children: [
                                {index: true, element: <Navigate replace={true} to={TopicDetailsTabs.Settings}/>},
                                {path: TopicDetailsTabs.Settings, element: <TopicSettings/>},
                            ]
                        }
                    ]
                },
                {
                    path: 'connectors',
                    children: [
                        {index: true, element: <Connectors/>},
                        {path: 'create', element: <Connectors/>},
                        {
                            path: ':id',
                            element: <ConnectorDetails/>,
                            children: [
                                {index: true, element: <Navigate replace={true} to={ConnectorDetailsTabs.Settings}/>},
                                {path: ConnectorDetailsTabs.Settings, element: <ConnectorSettings/>},
                                {path: ConnectorDetailsTabs.Configuration, element: <ConnectorConfiguration/>},
                            ]
                        }
                    ]
                },
                {
                    path: 'subscribers',
                    children: [
                        {index: true, element: <Subscribers/>},
                    ]
                },
                {
                    path: 'settings',
                    children: [
                        {index: true, element: <Settings/>},
                    ]
                },
                {
                    path: 'notifications',
                    children: [
                        {index: true, element: <Notifications/>},
                    ]
                },
            ]
        ), []
    )
}
import {useParams, useRoutes} from "react-router-dom";
import {ProjectContext} from "../../providers/ProjectProvider";
import {useEffect, useState} from "react";
import {useProjectRoutes} from "../../hooks/use-project-routes.tsx";
import TabNav from "../../components/TabNav";

import styles from './index.module.css'
import {TabNavItem} from "../../components/TabNavItem";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import {ProjectResponse} from "@astoniq/norm-schema";
import {RequestError, useApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR, {SWRConfig} from "swr";

export function ProjectContent() {

    const {projectId} = useParams<{ projectId: string }>()

    const [currentProjectId, setCurrentProjectId] = useState(projectId ?? '');

    const api = useApi()

    const swrOptions = useSwrOptions(api);

    const {
        data: currentProject,
        error,
        mutate
    } = useSWR<ProjectResponse, RequestError>(`projects/${projectId}`, swrOptions)

    const isLoading = !currentProject && !error

    useEffect(() => {
        setCurrentProjectId(projectId ?? '')
    }, [projectId, api])

    const tenantRoutes = useProjectRoutes()

    const {getTo, match} = useProjectPathname();

    const routes = useRoutes(tenantRoutes);

    if (!currentProject || isLoading) {
        return (
            <div>loading</div>
        )
    }

    return (
        <SWRConfig value={{provider: () => new Map()}}>
            <ProjectContext.Provider value={{
                currentProjectId,
                setCurrentProjectId,
                currentProject: currentProject,
                setCurrentProject: mutate
            }}>
                <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.info}>
                            <div>{currentProject.projectId}</div>
                        </div>

                        <TabNav className={styles.tabs}>
                            <TabNavItem isActive={match('/dashboard')}
                                        to={getTo('dashboard')}>
                                Dashboard
                            </TabNavItem>
                            <TabNavItem isActive={match('/notifications')}
                                        to={getTo('notifications')}>
                                Notifications
                            </TabNavItem>
                            <TabNavItem isActive={match('/connectors')}
                                        to={getTo('connectors')}>
                                Connectors
                            </TabNavItem>
                            <TabNavItem isActive={match('/resources')}
                                        to={getTo('resources')}>
                                Resources
                            </TabNavItem>
                            <TabNavItem isActive={match('/topics')}
                                        to={getTo('topics')}>
                                Topics
                            </TabNavItem>
                            <TabNavItem isActive={match('/subscribers')}
                                        to={getTo('subscribers')}>
                                Subscribers
                            </TabNavItem>
                            <TabNavItem isActive={match('/settings')}
                                        to={getTo('settings')}>
                                Settings
                            </TabNavItem>
                        </TabNav>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.contentWrapper}>
                        {routes}
                    </div>
                </div>
            </ProjectContext.Provider>
        </SWRConfig>

    )
}
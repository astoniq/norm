import {useParams, useRoutes} from "react-router-dom";
import {ProjectProvider} from "../../providers/ProjectProvider";
import {useEffect, useState} from "react";
import {useProjectRoutes} from "../../hooks/use-project-routes.tsx";
import TabNav from "../../components/TabNav";

import styles from './index.module.css'
import {TabNavItem} from "../../components/TabNavItem";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";

export function ProjectContent() {

    const {projectId} = useParams<{ projectId: string }>()

    const [currentProjectId, setCurrentProjectId] = useState(projectId ?? '');

    useEffect(() => {
        setCurrentProjectId(projectId ?? '')
    }, [projectId])

    const tenantRoutes = useProjectRoutes()

    const {getTo, match} = useProjectPathname();

    const routes = useRoutes(tenantRoutes);

    return (
        <ProjectProvider projectId={currentProjectId}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div>{projectId}</div>
                    <TabNav className={styles.tabs}>
                        <TabNavItem isActive={match('/dashboard')}
                                    to={getTo('dashboard')}>
                            Dashboard
                        </TabNavItem>
                        <TabNavItem isActive={match('/notifications')}
                                    to={getTo('notifications')}>
                            Notifications
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
        </ProjectProvider>
    )
}
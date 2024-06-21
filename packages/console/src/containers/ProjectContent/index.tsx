import {useParams, useRoutes} from "react-router-dom";
import {ProjectProvider} from "../../providers/ProjectProvider";
import {useEffect, useState} from "react";
import {useProjectRoutes} from "../../hooks/use-project-routes.tsx";

export function ProjectContent() {

    const {projectId} = useParams<{projectId: string}>()

    const [currentProjectId, setCurrentProjectId] = useState(projectId ?? '');

    useEffect(() => {
        setCurrentProjectId(projectId ?? '')
    }, [projectId])

    const tenantRoutes = useProjectRoutes()

    const routes = useRoutes(tenantRoutes);

    return (
        <ProjectProvider projectId={currentProjectId}>
            <div>tenant</div>
            {routes}
        </ProjectProvider>
    )
}
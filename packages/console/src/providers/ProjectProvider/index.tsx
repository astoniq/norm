import {createContext} from "react";
import {ProjectResponse} from "@astoniq/norm-schema";
import {noop} from "@astoniq/essentials";

export type CurrentProjectContext = {
    currentProjectId: string;
    setCurrentProjectId: (projectId: string) => void;
    currentProject: ProjectResponse
    setCurrentProject: (project: ProjectResponse) => void
}

export const ProjectContext = createContext<CurrentProjectContext>({
    currentProjectId: '',
    setCurrentProject: noop,
    currentProject: {} as ProjectResponse,
    setCurrentProjectId: noop
})

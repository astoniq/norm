import React, {createContext} from "react";

export const ProjectContext = createContext<string>("")

export type Props = {
    readonly projectId: string;
    readonly children?: React.ReactNode;
}

export function ProjectProvider({projectId, children}: Props) {
    return <ProjectContext.Provider value={projectId}>
        {children}
    </ProjectContext.Provider>
}
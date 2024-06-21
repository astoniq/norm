import {useContext} from "react";
import {ProjectContext} from "../providers/ProjectProvider";


export const useProject = () => useContext(ProjectContext);
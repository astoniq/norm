import {ProjectResponse} from "@astoniq/norm-schema";


export type ProjectSettingsForm = Pick<ProjectResponse, 'projectId' | 'clientKey'>
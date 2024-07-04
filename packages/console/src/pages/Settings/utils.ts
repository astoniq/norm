import {PatchProject, ProjectResponse} from "@astoniq/norm-schema";
import {ProjectSettingsForm} from "./types.ts";

export const projectFormParser = {
    toLocalForm: (data: ProjectResponse): ProjectSettingsForm => {

        const {
            projectId,
            clientKey
        } = data

        return {
            projectId,
            clientKey
        }
    },
    toRemoteModel: (data: ProjectSettingsForm): PatchProject => {
        const {
            projectId,
        } = data

        return {
            projectId
        }
    }
}
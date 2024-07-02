import {ConnectorResponse, PatchConnector} from "@astoniq/norm-schema";
import {ConnectorDetailsFormType} from "./types.ts";

export const connectorDetailsParser = {
    toLocalForm: (data: ConnectorResponse): ConnectorDetailsFormType => {

        const {
            connectorId
        } = data

        return {
            connectorId
        }
    },
    toRemoteModel: (data: ConnectorDetailsFormType): PatchConnector => {
        const {
            connectorId
        } = data

        return {
            connectorId
        }
    }
}
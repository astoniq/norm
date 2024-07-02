import {ConnectorResponse} from "@astoniq/norm-schema";

export type ConnectorDetailsOutletContext = {
    connector: ConnectorResponse
    isDeleting: boolean;
    onConnectorUpdated: (connector?: ConnectorResponse) => void
}

export type ConnectorDetailsFormType = Pick<ConnectorResponse, 'connectorId'>
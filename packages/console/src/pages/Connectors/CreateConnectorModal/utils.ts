import {ConnectorRadioGroupSize} from "../../../components/ConnectorRadioGroup";


export const getConnectorRadioGroupSize = (
    connectorCount: number,
): ConnectorRadioGroupSize => {
    if (connectorCount <= 2) {
        return 'medium';
    }

    if (connectorCount === 3) {
        return 'large';
    }

    return 'xlarge';
};

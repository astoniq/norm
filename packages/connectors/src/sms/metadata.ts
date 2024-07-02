import {ConnectorConfigFormItemType, ConnectorMetadata} from "@astoniq/norm-schema";

export const defaultMetadata: ConnectorMetadata = {
    formItems: [
        {
            key: 'host',
            label: 'Host',
            type: ConnectorConfigFormItemType.Text,
            required: true,
            placeholder: '<host>',
        },
        {
            key: 'port',
            label: 'Port',
            type: ConnectorConfigFormItemType.Number,
            required: true,
            placeholder: '25',
        },
    ],
};
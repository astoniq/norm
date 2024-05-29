import {ConnectorConfigFormItemType, ConnectorMetadata} from "../types/index.js";

export const defaultMetadata: ConnectorMetadata = {
    id: 'smtp',
    target: 'smtp',
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
        {
            key: 'auth',
            label: 'Auth',
            type: ConnectorConfigFormItemType.Json,
            required: true,
            defaultValue: {
                user: '<username>',
                pass: '<password>',
            },
        },
        {
            key: 'name',
            label: 'Name',
            type: ConnectorConfigFormItemType.Text,
            required: false,
            placeholder: '<name>',
        },
        {
            key: 'localAddress',
            label: 'Local Address',
            type: ConnectorConfigFormItemType.Text,
            required: false,
            placeholder: '<local_address>',
        },
        {
            key: 'connectionTimeout',
            label: 'Connection Timeout',
            type: ConnectorConfigFormItemType.Number,
            required: false,
            placeholder: '2 * 60 * 1000 (default is 2 minutes)',
        },
        {
            key: 'greetingTimeout',
            label: 'Greeting Timeout',
            type: ConnectorConfigFormItemType.Number,
            required: false,
            placeholder: '30 * 1000 (default is 30 seconds)',
        },
        {
            key: 'socketTimeout',
            label: 'Socket Timeout',
            type: ConnectorConfigFormItemType.Number,
            required: false,
            placeholder: '10 * 60 * 1000 (default is 10 minutes)',
        },
        {
            key: 'dnsTimeout',
            label: 'DNS Timeout',
            type: ConnectorConfigFormItemType.Number,
            required: false,
            placeholder: '30 * 1000 (default is 30 seconds)',
        },
        {
            key: 'secure',
            label: 'Secure',
            type: ConnectorConfigFormItemType.Switch,
            defaultValue: false,
        },
        {
            key: 'tls',
            label: 'TLS',
            type: ConnectorConfigFormItemType.Json,
            required: false,
            defaultValue: {},
        },
        {
            key: 'ignoreTLS',
            label: 'Ignore TLS',
            type: ConnectorConfigFormItemType.Switch,
            required: false,
        },
        {
            key: 'requireTLS',
            label: 'Require TLS',
            type: ConnectorConfigFormItemType.Switch,
            required: false,
        },
    ],
};
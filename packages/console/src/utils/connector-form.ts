import {ConnectorConfigFormItem, ConnectorConfigFormItemType, ConnectorResponse} from "@astoniq/norm-schema";
import {ConnectorFormType} from "../types";
import {conditional} from "@astoniq/essentials";
import {safeParseJson} from "./json.ts";

const initFormData = (formItems: ConnectorConfigFormItem[], config?: Record<string, unknown>) => {
    const data: Array<[string, unknown]> = formItems.map((item) => {
        const value = config?.[item.key] ?? item.defaultValue;

        if (item.type === ConnectorConfigFormItemType.Json) {
            return [item.key, JSON.stringify(value, null, 2)];
        }

        return [item.key, value];
    });

    return Object.fromEntries(data);
};

export const parseFormConfig = (
    config: Record<string, unknown>,
    formItems: ConnectorConfigFormItem[]
) => {
    return Object.fromEntries(
        Object.entries(config)
            .map(([key, value]) => {
                if (value === '') {
                    return null;
                }

                const formItem = formItems.find((item) => item.key === key);

                if (!formItem) {
                    return null;
                }

                if (formItem.type === ConnectorConfigFormItemType.Number) {
                    return Number.isNaN(value) ? null : [key, Number(value)];
                }

                if (formItem.type === ConnectorConfigFormItemType.Json) {
                    const result = safeParseJson(typeof value === 'string' ? value : '');

                    return [key, result.success ? result.data : {}];
                }

                return [key, value];
            })
            .filter((item): item is [string, unknown] => Array.isArray(item))
    );
};

export const convertResponseToForm = (connector: ConnectorResponse): ConnectorFormType => {
    const { metadata, type, config, target, name } = connector;
    const { formItems } = metadata;
    const formConfig = conditional(formItems && initFormData(formItems, config)) ?? {};

    return {
        name,
        type,
        target,
        jsonConfig: JSON.stringify(config, null, 2),
        formConfig,
        rawConfig: config,
    };
};
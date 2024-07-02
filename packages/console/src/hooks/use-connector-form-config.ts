import {useTranslation} from "react-i18next";
import {toast} from "react-hot-toast";
import {parseFormConfig, safeParseJsonObject} from "../utils";
import {ConnectorResponse} from "@astoniq/norm-schema";
import {ConnectorFormType} from "../types";


const useJsonStringConfigParser = () => {
    const {t} = useTranslation();

    return (config: string) => {
        if (!config) {
            toast.error(t('connector_details.save_error_empty_config'));

            return;
        }

        const result = safeParseJsonObject(config);

        if (!result.success) {
            toast.error(result.error);

            return;
        }

        return result.data;
    };
};

export const useConnectorFormConfigParser = () => {
    const parseJsonConfig = useJsonStringConfigParser();

    return (data: ConnectorFormType, {metadata}: ConnectorResponse) => {
        return metadata.formItems
            ? parseFormConfig(data.formConfig, metadata.formItems)
            : parseJsonConfig(data.jsonConfig);
    };
};
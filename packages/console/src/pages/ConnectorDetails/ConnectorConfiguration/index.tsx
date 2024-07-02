import {useOutletContext} from "react-router-dom";
import {
    ConnectorDetailsOutletContext
} from "../types.ts";
import {FormProvider, useForm} from "react-hook-form";
import {DetailsForm} from "../../../components/DetailsForm";
import {FormCard} from "../../../components/FormCard";
import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {toast} from "react-hot-toast";
import {ConnectorResponse} from "@astoniq/norm-schema";
import {DetailsPageContent} from "../../../components/DetailsPageContent";
import {convertResponseToForm, trySubmitSafe} from "../../../utils";
import {useMemo} from "react";
import {ConnectorFormType} from "../../../types";
import {useConnectorFormConfigParser} from "../../../hooks/use-connector-form-config.ts";
import {ConnectorConfigForm} from "../../../components/ConnectorConfigForm";

export function ConnectorConfiguration() {

    const {connector, onConnectorUpdated} = useOutletContext<ConnectorDetailsOutletContext>()

    const {t} = useTranslation()

    const formData = useMemo(() => convertResponseToForm(connector), [connector]);

    const formMethods = useForm<ConnectorFormType>({
        reValidateMode: 'onBlur',
        defaultValues: formData as Record<string, unknown>
    })

    const api = useProjectApi()

    const {
        formState: { isSubmitting, isDirty },
        handleSubmit,
        reset
    } = formMethods

    const {
        metadata
    } = connector;

    const configParser = useConnectorFormConfigParser();

    const onSubmit = handleSubmit(
        trySubmitSafe(async (formData) => {

            const {rawConfig} = formData

            const config = {...rawConfig, ...configParser(formData, connector)}

            const updatedConnector = await api
                .patch(`connectors/${connector.id}`,
                    {json: {config}})
                .json<ConnectorResponse>();

            reset(convertResponseToForm(updatedConnector));
            onConnectorUpdated(updatedConnector);
            toast.success(t('general.saved'));
        })
    );

    return (
        <DetailsPageContent
            title={'connector_details.configuration.configuration'}
            description={'connector_details.configuration.configuration_description'}
        >
            <DetailsForm
                autoComplete="off"
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onDiscard={reset}
            >
                <FormProvider {...formMethods}>
                    <FormCard title={'connector_details.configuration.form_title'}
                              description={'connector_details.configuration.form_description'}>
                        <ConnectorConfigForm formItems={metadata.formItems}/>
                    </FormCard>
                </FormProvider>
            </DetailsForm>
        </DetailsPageContent>
    )
}
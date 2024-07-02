import {useOutletContext} from "react-router-dom";
import {
    ConnectorDetailsFormType,
    ConnectorDetailsOutletContext
} from "../types.ts";
import {connectorDetailsParser} from "../utils.ts";
import {FormProvider, useForm} from "react-hook-form";
import {DetailsForm} from "../../../components/DetailsForm";
import {FormCard} from "../../../components/FormCard";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";
import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {toast} from "react-hot-toast";
import {ConnectorResponse} from "@astoniq/norm-schema";
import {DetailsPageContent} from "../../../components/DetailsPageContent";
import {trySubmitSafe} from "../../../utils";

export function ConnectorSettings() {

    const {connector, onConnectorUpdated} = useOutletContext<ConnectorDetailsOutletContext>()

    const {t} = useTranslation()

    const connectorFormData = connectorDetailsParser.toLocalForm(connector);

    const formMethods = useForm<ConnectorDetailsFormType>({
        defaultValues: connectorFormData
    })

    const api = useProjectApi()

    const {
        handleSubmit,
        reset,
        register,
        formState: {isSubmitting, isDirty, errors}
    } = formMethods

    const onSubmit = handleSubmit(
        trySubmitSafe(async (formData) => {
            const updatedConnector = await api
                .patch(`connectors/${connector.id}`,
                    {json: connectorDetailsParser.toRemoteModel(formData)})
                .json<ConnectorResponse>();

            reset(connectorDetailsParser.toLocalForm(updatedConnector));
            onConnectorUpdated(updatedConnector);
            toast.success(t('general.saved'));
        })
    );

    return (
        <DetailsPageContent
            title={'topic_details.settings.settings'}
            description={'topic_details.settings.settings_description'}
        >
            <DetailsForm
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onDiscard={reset}
            >
                <FormProvider {...formMethods}>
                    <FormCard title={'topic_details.settings.form_title'}
                              description={'topic_details.settings.form_description'}>
                        <FormField isRequired={true} title={'topics.topic_id'}>
                            <TextInput
                                {...register('connectorId', {
                                    required: true
                                })}
                                placeholder={t('topics.topic_id_placeholder')}
                                error={errors.connectorId?.message}
                            />
                        </FormField>
                    </FormCard>
                </FormProvider>
            </DetailsForm>
        </DetailsPageContent>
    )
}
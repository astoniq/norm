import {useOutletContext} from "react-router-dom";
import {ResourceDetailsFormType, ResourceDetailsOutletContext} from "../types.ts";
import {resourceDetailsParser} from "../utils.ts";
import {FormProvider, useForm} from "react-hook-form";
import {DetailsForm} from "../../../components/DetailsForm";
import {FormCard} from "../../../components/FormCard";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";
import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {toast} from "react-hot-toast";
import {ResourceResponse} from "@astoniq/norm-schema";
import {DetailsPageContent} from "../../../components/DetailsPageContent";
import {uriValidator, trySubmitSafe} from "../../../utils";

export function ResourceSettings() {

    const {resource, onResourceUpdated} = useOutletContext<ResourceDetailsOutletContext>()

    const {t} = useTranslation()

    const resourceFormData = resourceDetailsParser.toLocalForm(resource);

    const formMethods = useForm<ResourceDetailsFormType>({
        defaultValues: resourceFormData
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
            const updatedResource = await api
                .patch(`resources/${resource.id}`,
                    {json: resourceDetailsParser.toRemoteModel(formData)})
                .json<ResourceResponse>();
            reset(resourceDetailsParser.toLocalForm(updatedResource));
            onResourceUpdated(updatedResource);
            toast.success(t('general.saved'));
        })
    );

    return (
        <DetailsPageContent
            title={'resource_details.settings.settings'}
            description={'resource_details.settings.settings_description'}
        >
            <DetailsForm
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onDiscard={reset}
            >
                <FormProvider {...formMethods}>
                    <FormCard title={'resource_details.settings.form_title'}
                              description={'resource_details.settings.form_description'}>
                        <FormField isRequired={true} title={'resources.resource_id'}>
                            <TextInput
                                {...register('resourceId', {
                                    required: true
                                })}
                                placeholder={t('resources.resource_id_placeholder')}
                                error={errors.resourceId?.message}
                            />
                        </FormField>
                        <FormField isRequired={true} title={'resources.resource_url'}>
                            <TextInput
                                {...register('url', {
                                    required: true,
                                    validate: (value) => uriValidator(value) || t('errors.invalid_uri_format')|| ''
                                })}
                                placeholder={t('resources.resource_url_placeholder')}
                                error={errors.url?.message}
                            />
                        </FormField>
                    </FormCard>
                </FormProvider>
            </DetailsForm>
        </DetailsPageContent>

    )

}
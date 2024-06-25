import {useOutletContext} from "react-router-dom";
import {ResourceDetailsFormType, ResourceDetailsOutletContext} from "../types.ts";
import {resourceDetailsParser} from "../utils.ts";
import {FormProvider, useForm} from "react-hook-form";
import {DetailsForm} from "../../../components/DetailsForm";
import {FormCard} from "../../../components/FormCard";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";
import {useTranslation} from "react-i18next";
import {trySubmitSafe} from "../../../utils/form.ts";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {toast} from "react-hot-toast";
import {ResourceResponse} from "@astoniq/norm-schema";

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
        <DetailsForm
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onDiscard={reset}
        >
            <FormProvider {...formMethods}>
                <FormCard title={'resource_details.settings.settings'}
                          description={'resource_details.settings.settings_description'}>
                    <FormField isRequired={true} title={'resources.resource_id'}>
                        <TextInput
                            autoFocus={true}
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
                                required: true
                            })}
                            placeholder={t('resources.resource_url_placeholder')}
                            error={errors.resourceId?.message}
                        />
                    </FormField>
                </FormCard>
            </FormProvider>
        </DetailsForm>
    )

}
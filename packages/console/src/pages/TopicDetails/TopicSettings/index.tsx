import {useOutletContext} from "react-router-dom";
import {
    TopicDetailsFormType,
    TopicDetailsOutletContext
} from "../types.ts";
import {topicDetailsParser} from "../utils.ts";
import {FormProvider, useForm} from "react-hook-form";
import {DetailsForm} from "../../../components/DetailsForm";
import {FormCard} from "../../../components/FormCard";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";
import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {toast} from "react-hot-toast";
import {TopicResponse} from "@astoniq/norm-schema";
import {DetailsPageContent} from "../../../components/DetailsPageContent";
import {trySubmitSafe} from "../../../utils";

export function TopicSettings() {

    const {topic, onTopicUpdated} = useOutletContext<TopicDetailsOutletContext>()

    const {t} = useTranslation()

    const topicFormData = topicDetailsParser.toLocalForm(topic);

    const formMethods = useForm<TopicDetailsFormType>({
        defaultValues: topicFormData
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
            const updatedTopic = await api
                .patch(`topics/${topic.id}`,
                    {json: topicDetailsParser.toRemoteModel(formData)})
                .json<TopicResponse>();
            reset(topicDetailsParser.toLocalForm(updatedTopic));
            onTopicUpdated(updatedTopic);
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
                                {...register('topicId', {
                                    required: true
                                })}
                                placeholder={t('topics.topic_id_placeholder')}
                                error={errors.topicId?.message}
                            />
                        </FormField>
                    </FormCard>
                </FormProvider>
            </DetailsForm>
        </DetailsPageContent>
    )
}
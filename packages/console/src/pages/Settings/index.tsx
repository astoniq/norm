import styles from './index.module.css'
import {CardTitle} from "../../components/CardTitle";
import {FormProvider, useForm} from "react-hook-form";
import {FormCard} from "../../components/FormCard";
import {FormField} from "../../components/FormField";
import TextInput from "../../components/TextInput";
import {trySubmitSafe} from "../../utils";
import {DetailsForm} from "../../components/DetailsForm";
import {useTranslation} from "react-i18next";
import {ProjectSettingsForm} from "./types.ts";
import {useContext} from "react";
import {ProjectContext} from "../../providers/ProjectProvider";
import {ProjectResponse} from "@astoniq/norm-schema";
import {toast} from "react-hot-toast";
import {projectFormParser} from "./utils.ts";
import {useApi} from "../../hooks/use-api.ts";

export function Settings() {

    const {currentProject, setCurrentProject, currentProjectId} = useContext(ProjectContext)

    const projectFormData = projectFormParser.toLocalForm(currentProject);

    const methods = useForm<ProjectSettingsForm>({
        defaultValues: projectFormData,
    });

    const {t} = useTranslation()

    const api = useApi()

    const {
        reset,
        handleSubmit,
        register,
        formState: { isDirty, isSubmitting, errors },
    } = methods;

    const onSubmit = handleSubmit(
        trySubmitSafe(async (formData) => {
            const updatedProject = await api
                .patch(`projects/${currentProjectId}`,
                    {json: projectFormParser.toRemoteModel(formData)})
                .json<ProjectResponse>();
            reset(projectFormParser.toLocalForm(updatedProject));
            setCurrentProject(updatedProject);
            toast.success(t('general.saved'));
        })
    )

    return (
        <div className={styles.container}>
            <CardTitle
                title={'connector_details.activate_action'}
                subtitle={'connectors.connector_status_disabled'}
                className={styles.header}
            />
            <DetailsForm
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onDiscard={reset}
            >
                <FormProvider {...methods}>
                    <FormCard title={'resource_details.settings.form_title'}
                              description={'resource_details.settings.form_description'}>
                        <FormField isRequired={true} title={'resources.resource_id'}>
                            <TextInput
                                {...register('projectId', {
                                    required: true
                                })}
                                placeholder={t('resources.resource_id_placeholder')}
                                error={errors.projectId?.message}
                            />
                        </FormField>
                        <FormField isRequired={true} title={'resources.resource_url'}>
                            <TextInput
                                {...register('clientKey', {
                                    required: true,
                                    disabled: true
                                })}
                                placeholder={t('resources.resource_url_placeholder')}
                                error={errors.clientKey?.message}
                            />
                        </FormField>
                    </FormCard>
                </FormProvider>
            </DetailsForm>
        </div>
    )
}
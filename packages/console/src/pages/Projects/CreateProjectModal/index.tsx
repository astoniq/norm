import {Modal} from "../../../components/Modal";
import {CreateProject, Project, ProjectResponse} from "@astoniq/norm-schema";
import {useTranslation} from "react-i18next";
import {useApi} from "../../../hooks/use-api.ts";
import {useForm} from "react-hook-form";
import {trySubmitSafe} from "../../../utils";
import {ModalLayout} from "../../../components/ModalLayout";
import Button from "../../../components/Button";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";

export type CreateProjectModalProps = {
    readonly onClose: (createdProject?: Project) => void
}

export type CreateProjectFormData = Pick<Project, 'projectId'>

export function CreateProjectModal({onClose}: CreateProjectModalProps) {

    const {t} = useTranslation()

    const api = useApi()

    const {
        handleSubmit,
        register,
        formState: {isSubmitting, errors}
    } = useForm<CreateProjectFormData>()

    const onSubmit = handleSubmit(
        trySubmitSafe(async ({projectId}) => {
            if (isSubmitting) {
                return;
            }

            const payload: CreateProject = {
                projectId
            }

            const createdProject = await api.post('projects',
                {json: payload}).json<ProjectResponse>();

            onClose(createdProject);
        })
    )

    return (
        <Modal onClose={onClose}>
            <ModalLayout
                title={'projects.create_project_title'}
                subtitle={'projects.create_project_description'}
                size={"large"}
                footer={
                    <Button
                        htmlType={'submit'}
                        title={'projects.create_project_button'}
                        size={'large'}
                        type={'primary'}
                        isLoading={isSubmitting}
                        onClick={onSubmit}
                    />
                }
                onClose={onClose}
            >
                <form>
                    <FormField isRequired={true} title={'projects.project_id'}>
                        <TextInput
                            autoFocus={true}
                            {...register('projectId', {
                                required: true
                            })}
                            placeholder={t('projects.project_id_placeholder')}
                            error={errors.projectId?.message}
                        />
                    </FormField>
                </form>
            </ModalLayout>
        </Modal>
    )
}
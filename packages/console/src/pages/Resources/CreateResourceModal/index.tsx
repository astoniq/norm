import {Modal} from "../../../components/Modal";
import {CreateResource, Resource} from "@astoniq/norm-schema";
import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {useForm} from "react-hook-form";
import {trySubmitSafe, uriValidator} from "../../../utils";
import {ModalLayout} from "../../../components/ModalLayout";
import Button from "../../../components/Button";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";

export type CreateResourceModalProps = {
    readonly onClose: (createdResource?: Resource) => void
}

export type CreateResourceFormData = Pick<CreateResource, 'resourceId'> & {
    url: string;
}

export function CreateResourceModal({onClose}: CreateResourceModalProps) {

    const {t} = useTranslation()

    const api = useProjectApi()

    const {
        handleSubmit,
        register,
        formState: {isSubmitting, errors}
    } = useForm<CreateResourceFormData>()

    const onSubmit = handleSubmit(
        trySubmitSafe(async ({resourceId, url}) => {
            if (isSubmitting) {
                return;
            }

            const payload: CreateResource = {
                resourceId,
                config: {
                    url
                }
            }

            const createdRole = await api.post('resources',
                {json: payload}).json<Resource>();

            onClose(createdRole);
        })
    )

    return (
        <Modal onClose={onClose}>
            <ModalLayout
                title={'resources.create_resource_title'}
                subtitle={'resources.create_resource_description'}
                size={"large"}
                footer={
                    <Button
                        htmlType={'submit'}
                        title={'resources.create_resource_button'}
                        size={'large'}
                        type={'primary'}
                        isLoading={isSubmitting}
                        onClick={onSubmit}
                    />
                }
                onClose={onClose}
            >
                <form>
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
                                required: true,
                                validate: (value) => uriValidator(value) || t('errors.invalid_uri_format')|| ''
                            })}
                            placeholder={t('resources.resource_url_placeholder')}
                            error={errors.url?.message}
                        />
                    </FormField>
                </form>
            </ModalLayout>
        </Modal>
    )
}
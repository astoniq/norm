import {ModalLayout} from "../../../components/ModalLayout";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";
import {useTranslation} from "react-i18next";
import {Footer} from "./Footer.tsx";
import {useForm} from "react-hook-form";
import {CreateResource, Resource} from "@astoniq/norm-schema";
import {trySubmitSafe} from "../../../utils/form.ts";
import {useTenantApi} from "../../../hooks/use-api.ts";


export type CreateResourceFormProps = {
    readonly onClose: (createdResource?: Resource) => void
}

export type CreateResourceFormData = Pick<CreateResource, 'resourceId'> & {
    url: string;
}

export function CreateResourceForm({onClose}: CreateResourceFormProps) {


    const {t} = useTranslation()

    const api = useTenantApi()

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
        <ModalLayout
            title={'resources.create_resource_title'}
            subtitle={'resources.create_resource_description'}
            size={"large"}
            footer={
                <Footer
                    isCreating={isSubmitting}
                    onClickCreate={onSubmit}
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
                        autoFocus={true}
                        {...register('url', {
                            required: true
                        })}
                        placeholder={t('resources.resource_url_placeholder')}
                        error={errors.resourceId?.message}
                    />
                </FormField>
            </form>
        </ModalLayout>
    )
}
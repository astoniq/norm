import {Modal} from "../../../components/Modal";
import {CreateTopic, Topic} from "@astoniq/norm-schema";
import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {useForm} from "react-hook-form";
import {trySubmitSafe} from "../../../utils";
import {ModalLayout} from "../../../components/ModalLayout";
import Button from "../../../components/Button";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";

export type CreateConnectorModalProps = {
    readonly onClose: (createdTopic?: Topic) => void
}

export type CreateTopicFormData = Pick<Topic, 'topicId'>

export function CreateConnectorModal({onClose}: CreateConnectorModalProps) {

    const {t} = useTranslation()

    const api = useProjectApi()

    const {
        handleSubmit,
        register,
        formState: {isSubmitting, errors}
    } = useForm<CreateTopicFormData>()

    const onSubmit = handleSubmit(
        trySubmitSafe(async ({topicId}) => {
            if (isSubmitting) {
                return;
            }

            const payload: CreateTopic = {
                topicId
            }

            const createdTopic = await api.post('topics',
                {json: payload}).json<Topic>();

            onClose(createdTopic);
        })
    )

    return (
        <Modal onClose={onClose}>
            <ModalLayout
                title={'topics.create_topic_title'}
                subtitle={'topics.create_topic_description'}
                size={"large"}
                footer={
                    <Button
                        htmlType={'submit'}
                        title={'topics.create_topic_button'}
                        size={'large'}
                        type={'primary'}
                        isLoading={isSubmitting}
                        onClick={onSubmit}
                    />
                }
                onClose={onClose}
            >
                <form>
                    <FormField isRequired={true} title={'topics.topic_id'}>
                        <TextInput
                            autoFocus={true}
                            {...register('topicId', {
                                required: true
                            })}
                            placeholder={t('topics.topic_id_placeholder')}
                            error={errors.topicId?.message}
                        />
                    </FormField>
                </form>
            </ModalLayout>
        </Modal>
    )
}
import {Modal} from "../../../components/Modal";
import {Connector, ConnectorFactoryResponse, CreateConnector} from "@astoniq/norm-schema";
import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../hooks/use-api.ts";
import {useForm} from "react-hook-form";
import {trySubmitSafe} from "../../../utils";
import {ModalLayout} from "../../../components/ModalLayout";
import Button from "../../../components/Button";
import {FormField} from "../../../components/FormField";
import TextInput from "../../../components/TextInput";
import useSWR from "swr";
import {useSwrOptions} from "../../../hooks/use-swr-options.ts";
import {useMemo, useState} from "react";
import {getConnectorRadioGroupSize} from "./utils.ts";
import Skeleton from "../../../components/FormCardSkeleton";
import {ConnectorRadioGroup} from "../../../components/ConnectorRadioGroup";

export type CreateConnectorModalProps = {
    readonly onClose: (createdConnector?: Connector) => void
}

export type CreateConnectorFormData = Pick<Connector, 'connectorId'>

const apiPathname = 'connector-factories'

export function CreateConnectorModal({onClose: rawOnClose}: CreateConnectorModalProps) {

    const {t} = useTranslation()

    const api = useProjectApi()

    const swrOptions = useSwrOptions(api);

    const [selectedFactory, setSelectedFactory] = useState<string>();

    const {data = [], error} = useSWR<ConnectorFactoryResponse[]>(apiPathname, swrOptions)

    const isLoading = !data && !error;

    const radioGroupSize = getConnectorRadioGroupSize(data.length);

    const isAnyConnectorSelected = useMemo(
        () =>
            data.some(
                ({name}) => selectedFactory === name
            ),
        [data, selectedFactory]
    );

    const {
        handleSubmit,
        register,
        reset,
        formState: {isSubmitting, errors},
        watch
    } = useForm<CreateConnectorFormData>({resetOptions: {keepErrors: true}})

    const onClose = (connector?: Connector) => {
        setSelectedFactory(undefined);
        reset();
        rawOnClose(connector);
    };

    const handleSelection = (name: string) => {
        setSelectedFactory(name);
    };

    const onSubmit = handleSubmit(
        trySubmitSafe(async ({connectorId}) => {
            if (isSubmitting) {
                return;
            }

            if (!selectedFactory) {
                return;
            }

            const payload: CreateConnector = {
                connectorId,
                name: selectedFactory
            }

            const createdConnector = await api.post('connectors',
                {json: payload}).json<Connector>();

            onClose(createdConnector);
        })
    )

    return (
        <Modal onClose={onClose}>
            <ModalLayout
                title={'connectors.create_connector_title'}
                subtitle={'connectors.create_connector_description'}
                size={"large"}
                footer={
                    <Button
                        htmlType={'submit'}
                        title={'connectors.create_connector_button'}
                        size={'large'}
                        type={'primary'}
                        disabled={!(watch('connectorId') && isAnyConnectorSelected) || Boolean(errors.connectorId)}
                        isLoading={isSubmitting}
                        onClick={onSubmit}
                    />
                }
                onClose={onClose}
            >
                {isLoading && <Skeleton/>}
                {error?.message}
                <ConnectorRadioGroup name={'factory'}
                                     connectors={data}
                                     value={selectedFactory}
                                     size={radioGroupSize}
                                     onChange={handleSelection}/>
                <FormField isRequired={true} title={'connectors.connector_id'}>
                    <TextInput
                        autoFocus={true}
                        {...register('connectorId', {
                            required: true
                        })}
                        placeholder={t('connectors.connector_id_placeholder')}
                        error={errors.connectorId?.message}
                    />
                </FormField>
            </ModalLayout>
        </Modal>
    )
}
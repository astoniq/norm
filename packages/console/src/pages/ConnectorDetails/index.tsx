import {DetailsPage} from "../../components/DetailsPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import useSWR from "swr";
import {ConnectorResponse} from "@astoniq/norm-schema";
import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import {Outlet, useLocation, useParams} from "react-router-dom";
import {ConnectorDetailsOutletContext} from "./types.ts";
import {useEffect, useState} from "react";
import {ConfirmModal} from "../../components/ConfirmModal";
import {useTranslation} from "react-i18next";
import {DeleteIcon} from "../../icons/DeleteIcon.tsx";
import {toast} from "react-hot-toast";
import {DetailsPageIcon} from "../../components/DetailsPageIcon";
import {DetailsPageContainer} from "../../components/DetailsPageContainer";
import {ConnectorDetailsTabs} from "../../constants";


export function ConnectorDetails() {

    const {getTo, navigate, match} = useProjectPathname();

    const api = useProjectApi();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const {id} = useParams();

    const {pathname} = useLocation()

    const {data, error, mutate} = useSWR<ConnectorResponse, RequestError>(`connectors/${id}`, swrOptions)

    const isLoading = !data && !error

    const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setIsDeleteFormOpen(false)
    }, [pathname])

    const onDelete = async () => {
        if (!data || isDeleting) {
            return
        }

        setIsDeleting(true)

        try {
            await api.delete(`connectors/${data.id}`)
            toast.success(t('connector_details.deleted'));
            navigate('/connectors')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <DetailsPage
            backLink={getTo('/connectors')}
            backLinkTitle={'connector_details.back_to_connectors'}
            isLoading={isLoading}
            error={error}
            onRetry={mutate}
            pageMeta={{
                titleKey: 'connector_details.page_title'
            }}
        >
            {data && (
                <DetailsPageContainer
                    header={
                        {
                            title: data.connectorId,
                            identifier: {name: 'ID', value: data.id},
                            icon: <DetailsPageIcon name={data.connectorId} size={'xlarge'}/>,
                            actionMenuItems: [
                                {
                                    title: 'general.delete',
                                    icon: <DeleteIcon/>,
                                    type: 'danger',
                                    onClick: () => {
                                        setIsDeleteFormOpen(true)
                                    }
                                }
                            ]
                        }}
                    sidebar={{
                        match,
                        getTo,
                        items: [
                            {
                                title: t('connector_details.configuration_tab'),
                                link: `/connectors/${data.id}/${ConnectorDetailsTabs.Configuration}`,
                            },
                            {
                                title: t('connector_details.settings_tab'),
                                link: `/connectors/${data.id}/${ConnectorDetailsTabs.Settings}`,
                            },
                        ]
                    }}
                    content={
                        <Outlet
                            context={{
                                connector: data,
                                isDeleting,
                                onConnectorUpdated: (connector) => {
                                    if (connector) {
                                        void mutate(connector)
                                    }
                                    void mutate()
                                }
                            } satisfies ConnectorDetailsOutletContext}
                        />
                    }
                    widgets={
                        <ConfirmModal
                            isOpen={isDeleteFormOpen}
                            isLoading={isDeleting}
                            confirmButtonText="general.delete"
                            onCancel={() => {
                                setIsDeleteFormOpen(false);
                            }}
                            onConfirm={onDelete}
                        >
                            {t('connector_details.delete_description')}
                        </ConfirmModal>
                    }/>
            )}
        </DetailsPage>
    )
}
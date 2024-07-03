import {DetailsPage} from "../../components/DetailsPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import useSWR from "swr";
import {PatchResource, ResourceResponse} from "@astoniq/norm-schema";
import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import {Outlet, useLocation, useParams} from "react-router-dom";
import {ResourceDetailsOutletContext} from "./types.ts";
import {useEffect, useState} from "react";
import {ConfirmModal} from "../../components/ConfirmModal";
import {useTranslation} from "react-i18next";
import {DeleteIcon} from "../../icons/DeleteIcon.tsx";
import {toast} from "react-hot-toast";
import {DetailsPageIcon} from "../../components/DetailsPageIcon";
import {DetailsPageContainer} from "../../components/DetailsPageContainer";
import {ResourceDetailsTabs} from "../../constants";
import {ForbiddenIcon} from "../../icons/ForbiddenIcon.tsx";
import {ShieldIcon} from "../../icons/ShieldIcon.tsx";


export function ResourceDetails() {

    const {getTo, navigate, match} = useProjectPathname();

    const api = useProjectApi();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const {id} = useParams();

    const {pathname} = useLocation()

    const {data, error, mutate} = useSWR<ResourceResponse, RequestError>(`resources/${id}`, swrOptions)

    const isLoading = !data && !error

    const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggleSuspendFormOpen, setIsToggleSuspendFormOpen] = useState(false)
    const [isUpdatingSuspendState, setIsUpdatingSuspendState] = useState(false);

    useEffect(() => {
        setIsDeleteFormOpen(false)
        setIsToggleSuspendFormOpen(false);
        setIsUpdatingSuspendState(false)
    }, [pathname])

    const onDelete = async () => {
        if (!data || isDeleting) {
            return
        }

        setIsDeleting(true)

        try {
            await api.delete(`resources/${data.id}`)
            toast.success(t('resource_details.deleted'));
            navigate('/resources')
        } finally {
            setIsDeleting(false)
        }
    }

    const onToggleSuspendState = async () => {
        if (!data || isUpdatingSuspendState) {
            return;
        }

        setIsUpdatingSuspendState(true);

        const payload: PatchResource = {
            enabled: !data.enabled
        }

        try {
            const updatedResource = await api
                .patch(`resources/${data.id}`, {json: payload})
                .json<ResourceResponse>();
            void mutate(updatedResource);
            setIsToggleSuspendFormOpen(false);
            toast.success(
                t(updatedResource.enabled ? 'resource_details.resource_activated' : 'resource_details.resource_disabled')
            );
        } finally {
            setIsUpdatingSuspendState(false);
        }
    };

    return (
        <DetailsPage
            backLink={getTo('/resources')}
            backLinkTitle={'resource_details.back_to_resources'}
            isLoading={isLoading}
            error={error}
            onRetry={mutate}
            pageMeta={{
                titleKey: 'resource_details.page_title'
            }}
        >
            {data && (
                <DetailsPageContainer
                    header={
                        {
                            title: data.resourceId,
                            identifier: {name: 'ID', value: data.id},
                            icon: <DetailsPageIcon name={data.resourceId} size={'xlarge'}/>,
                            actionMenuItems: [
                                {
                                    title: data.enabled
                                        ? `resource_details.disable_resource`
                                        : 'resource_details.activate_resource',
                                    icon: data.enabled ? <ForbiddenIcon/> : <ShieldIcon/>,
                                    onClick: () => {
                                        setIsToggleSuspendFormOpen(true)
                                    }
                                },
                                {
                                    title: 'general.delete',
                                    icon: <DeleteIcon/>,
                                    type: 'danger',
                                    onClick: () => {
                                        setIsDeleteFormOpen(true)
                                    }
                                }
                            ],
                            statusTag: {
                                status: data.enabled ? 'success' : 'error',
                                text: data.enabled
                                    ? 'resources.resource_status_enabled'
                                    : 'resources.resource_status_disabled',
                            }
                        }}
                    sidebar={{
                        match,
                        getTo,
                        items: [
                            {
                                title: t('resource_details.workflows_tab'),
                                link: `/resources/${data.id}/${ResourceDetailsTabs.Workflows}`,
                            },
                            {
                                title: t('resource_details.security_tab'),
                                link: `/resources/${data.id}/${ResourceDetailsTabs.Security}`,
                            },
                            {
                                title: t('resource_details.settings_tab'),
                                link: `/resources/${data.id}/${ResourceDetailsTabs.Settings}`,
                            },
                        ]
                    }}
                    content={
                        <Outlet
                            context={{
                                resource: data,
                                isDeleting,
                                onResourceUpdated: (resource) => {
                                    if (resource) {
                                        void mutate(resource)
                                    }
                                    void mutate()
                                }
                            } satisfies ResourceDetailsOutletContext}
                        />
                    }
                    widgets={
                        <>
                            <ConfirmModal
                                isOpen={isDeleteFormOpen}
                                isLoading={isDeleting}
                                confirmButtonText="general.delete"
                                onCancel={() => {
                                    setIsDeleteFormOpen(false);
                                }}
                                onConfirm={onDelete}
                            >
                                {t('resource_details.delete_description')}
                            </ConfirmModal>
                            <ConfirmModal
                                isOpen={isToggleSuspendFormOpen}
                                isLoading={isUpdatingSuspendState}
                                confirmButtonText={
                                    data.enabled ? 'connector_details.disable_action' : 'connector_details.activate_action'
                                }
                                onCancel={() => {
                                    setIsToggleSuspendFormOpen(false);
                                }}
                                onConfirm={onToggleSuspendState}
                            >
                                {t(
                                    data.enabled
                                        ? 'connector_details.disable_connector_reminder'
                                        : 'connector_details.activate_connector_reminder'
                                )}
                            </ConfirmModal>
                        </>
                    }/>
            )}
        </DetailsPage>
    )
}
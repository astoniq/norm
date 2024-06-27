import {DetailsPage} from "../../components/DetailsPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import useSWR from "swr";
import {ResourceResponse} from "@astoniq/norm-schema";
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

    useEffect(() => {
        setIsDeleteFormOpen(false)
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
                    }/>
            )}
        </DetailsPage>
    )
}
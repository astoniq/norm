import {DetailsPage} from "../../components/DetailsPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import useSWR from "swr";
import {TopicResponse} from "@astoniq/norm-schema";
import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import {Outlet, useLocation, useParams} from "react-router-dom";
import {TopicDetailsOutletContext} from "./types.ts";
import {useEffect, useState} from "react";
import {ConfirmModal} from "../../components/ConfirmModal";
import {useTranslation} from "react-i18next";
import {DeleteIcon} from "../../icons/DeleteIcon.tsx";
import {toast} from "react-hot-toast";
import {DetailsPageIcon} from "../../components/DetailsPageIcon";
import {DetailsPageContainer} from "../../components/DetailsPageContainer";
import {TopicDetailsTabs} from "../../constants";


export function TopicDetails() {

    const {getTo, navigate, match} = useProjectPathname();

    const api = useProjectApi();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const {id} = useParams();

    const {pathname} = useLocation()

    const {data, error, mutate} = useSWR<TopicResponse, RequestError>(`topics/${id}`, swrOptions)

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
            await api.delete(`topics/${data.id}`)
            toast.success(t('topic_details.deleted'));
            navigate('/topics')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <DetailsPage
            backLink={getTo('/topics')}
            backLinkTitle={'topic_details.back_to_topics'}
            isLoading={isLoading}
            error={error}
            onRetry={mutate}
            pageMeta={{
                titleKey: 'topic_details.page_title'
            }}
        >
            {data && (
                <DetailsPageContainer
                    header={
                        {
                            title: data.topicId,
                            identifier: {name: 'ID', value: data.id},
                            icon: <DetailsPageIcon name={data.topicId} size={'xlarge'}/>,
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
                                title: t('topic_details.subscribers_tab'),
                                link: `/topics/${data.id}/${TopicDetailsTabs.Subscribers}`,
                            },
                            {
                                title: t('topic_details.settings_tab'),
                                link: `/topics/${data.id}/${TopicDetailsTabs.Settings}`,
                            },
                        ]
                    }}
                    content={
                        <Outlet
                            context={{
                                topic: data,
                                isDeleting,
                                onTopicUpdated: (topic) => {
                                    if (topic) {
                                        void mutate(topic)
                                    }
                                    void mutate()
                                }
                            } satisfies TopicDetailsOutletContext}
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
                            {t('topic_details.delete_description')}
                        </ConfirmModal>
                    }/>
            )}
        </DetailsPage>
    )
}
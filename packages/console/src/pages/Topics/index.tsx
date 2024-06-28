import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../hooks/use-search-parameters.ts";
import {buildUrl} from "../../utils";
import {defaultPaginationPageSize, TopicPaginationResponse} from "@astoniq/norm-schema";
import {ItemPreview} from "../../components/ItemPreview";
import {toast} from "react-hot-toast";
import {CreateTopicModal} from "./CreateTopicModal";

const apiPathname = 'topics'
const topicsPathname = '/topics';
const createTopicPathname = `${topicsPathname}/create`;

const pageSize = defaultPaginationPageSize;

const buildDetailsPathname = (id: string) => `${topicsPathname}/${id}`;

export const Topics = () => {

    const api = useProjectApi();

    const {navigate, match} = useProjectPathname();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const {search} = useLocation();

    const isCreating = match(createTopicPathname);

    const [{page}, updateSearchParameters] = useSearchParameters({
        page: 1,
    })

    const url = buildUrl(apiPathname, {
        page: String(page),
        page_size: String(pageSize)
    })

    const {getTo} = useProjectPathname();

    const {data, error, mutate} = useSWR<TopicPaginationResponse, RequestError>(url, swrOptions)

    const isLoading = !data && !error

    const {items = [], totalCount} = data ?? {}

    return (
        <ListPage
            title={{
                title: 'topics.title',
                subtitle: 'topics.subtitle'
            }}
            createButton={{
                title: 'topics.create',
                onClick: () => navigate({pathname: createTopicPathname, search})
            }}
            pageMeta={{
                titleKey: 'topics.page_title'
            }}
            table={{
                rowGroups: [{key: 'topics', items}],
                rowIndexKey: 'id',
                isLoading: isLoading,
                errorMessage: error?.message,
                columns: [
                    {
                        title: t('topics.topic_id'),
                        dataIndex: 'topic_id',
                        colSpan: 12,
                        render: ({id, topicId}) => (
                            <ItemPreview title={topicId}
                                         to={getTo(buildDetailsPathname(id))}/>
                        )
                    },
                ],
                pagination: {
                    page,
                    totalCount,
                    pageSize,
                    onChange: (page) => {
                        updateSearchParameters({page})
                    }
                },
                onRetry: async () => mutate(undefined, true)
            }}
            widgets={
                isCreating && (
                    <CreateTopicModal
                        onClose={(createdTopic) => {
                            if (createdTopic) {
                                void mutate()
                                toast.success(t('topics.topic_created'))
                                navigate(buildDetailsPathname(createdTopic.id), {replace: true});
                                return;
                            }

                            navigate({pathname: topicsPathname, search})
                        }}/>
                )
            }
        />
    )
}
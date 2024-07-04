import {RequestError, useApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../hooks/use-search-parameters.ts";
import {buildUrl} from "../../utils";
import {defaultPaginationPageSize, ProjectPaginationResponse} from "@astoniq/norm-schema";
import {ItemPreview} from "../../components/ItemPreview";
import {toast} from "react-hot-toast";
import {CreateProjectModal} from "./CreateProjectModal";
import {useState} from "react";

const apiPathname = 'projects'
const projectsPathname = '/projects';

const pageSize = defaultPaginationPageSize;

const buildDetailsPathname = (id: string) => `${projectsPathname}/${id}`;

export const Projects = () => {

    const api = useApi();

    const [isCreating, setIsCreating] = useState(false)

    const navigate = useNavigate()

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()


    const [{page}, updateSearchParameters] = useSearchParameters({
        page: 1,
    })

    const url = buildUrl(apiPathname, {
        page: String(page),
        page_size: String(pageSize)
    })


    const {data, error, mutate} = useSWR<ProjectPaginationResponse, RequestError>(url, swrOptions)

    const isLoading = !data && !error

    const {items = [], totalCount} = data ?? {}

    return (
        <ListPage
            title={{
                title: 'projects.title',
                subtitle: 'projects.subtitle'
            }}
            createButton={{
                title: 'projects.create',
                onClick: () => setIsCreating(true)
            }}
            pageMeta={{
                titleKey: 'projects.page_title'
            }}
            table={{
                rowGroups: [{key: 'projects', items}],
                rowIndexKey: 'id',
                isLoading: isLoading,
                errorMessage: error?.message,
                columns: [
                    {
                        title: t('projects.project_id'),
                        dataIndex: 'project_id',
                        colSpan: 12,
                        render: ({id, projectId}) => (
                            <ItemPreview title={projectId}
                                         to={buildDetailsPathname(id)}/>
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
                    <CreateProjectModal
                        onClose={(createdTopic) => {
                            setIsCreating(false)
                            if (createdTopic) {
                                void mutate()
                                toast.success(t('projects.project_created'))
                                navigate(buildDetailsPathname(createdTopic.id), {replace: true});
                                return;
                            }
                        }}/>
                )
            }
        />
    )
}
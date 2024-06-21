import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import {CreateResourceModal} from "./CreateResourceModal";
import {useLocation} from "react-router-dom";
import {toast} from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../hooks/use-search-parameters.ts";
import {buildUrl} from "../../utils";
import {defaultPaginationPageSize, ResourcePaginationResponse} from "@astoniq/norm-schema";
import {ItemPreview} from "../../components/ItemPreview";

const apiPathname = 'resources'
const resourcesPathname = '/resources';
const createResourcePathname = `${resourcesPathname}/create`;


const pageSize = defaultPaginationPageSize;

export const Resources = () => {

    const api = useProjectApi();

    const {navigate, match} = useProjectPathname();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const isCreating = match(createResourcePathname);

    const {search} = useLocation();

    const [{page}, updateSearchParameters] = useSearchParameters({
        page: 1,
    })

    const url = buildUrl(apiPathname, {
        page: String(page),
        page_size: String(pageSize)
    })

    const { getTo } = useProjectPathname();

    const buildDetailsPathname = (id: string) => getTo(`${resourcesPathname}/${id}`);

    const {data, error, mutate} = useSWR<ResourcePaginationResponse, RequestError>(url, swrOptions)

    const isLoading = !data && !error

    const {items = [], totalCount} = data ?? {}

    return (
        <ListPage
            title={{
                title: 'resources.title',
                subtitle: 'resources.subtitle'
            }}
            createButton={{
                title: 'resources.create',
                onClick: () => navigate({pathname: createResourcePathname, search})
            }}

            table={{
                rowGroups: [{key: 'resources', items}],
                rowIndexKey: 'id',
                isLoading: isLoading,
                errorMessage: error?.message,
                columns: [
                    {
                        title: t('resources.resource_id'),
                        dataIndex: 'resource_id',
                        colSpan: 12,
                        render: ({id, resourceId}) => (
                            <ItemPreview title={resourceId}
                                         to={buildDetailsPathname(id)}/>
                        )
                    }
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
                    <CreateResourceModal
                        onClose={(createdResource) => {
                            if (createdResource) {
                                void mutate()
                                toast.success(t('resources.resource_created'))
                                navigate(buildDetailsPathname(createdResource.id), {replace: true});
                                return;
                            }

                            navigate({pathname: resourcesPathname, search})
                        }}/>
                )
            }
        />
    )
}
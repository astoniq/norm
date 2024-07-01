import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../hooks/use-search-parameters.ts";
import {buildUrl} from "../../utils";
import {ConnectorPaginationResponse, defaultPaginationPageSize} from "@astoniq/norm-schema";
import {ItemPreview} from "../../components/ItemPreview";
import {toast} from "react-hot-toast";
import {CreateConnectorModal} from "./CreateConnectorModal";

const apiPathname = 'connectors'
const connectorsPathname = '/connectors';
const createConnectorPathname = `${connectorsPathname}/create`;

const pageSize = defaultPaginationPageSize;

const buildDetailsPathname = (id: string) => `${connectorsPathname}/${id}`;

export const Connectors = () => {

    const api = useProjectApi();

    const {navigate, match} = useProjectPathname();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const {search} = useLocation();

    const isCreating = match(createConnectorPathname);

    const [{page}, updateSearchParameters] = useSearchParameters({
        page: 1,
    })

    const url = buildUrl(apiPathname, {
        page: String(page),
        page_size: String(pageSize)
    })

    const {getTo} = useProjectPathname();

    const {data, error, mutate} = useSWR<ConnectorPaginationResponse, RequestError>(url, swrOptions)

    const isLoading = !data && !error

    const {items = [], totalCount} = data ?? {}

    return (
        <ListPage
            title={{
                title: 'connectors.title',
                subtitle: 'connectors.subtitle'
            }}
            createButton={{
                title: 'connectors.create',
                onClick: () => navigate({pathname: createConnectorPathname, search})
            }}
            pageMeta={{
                titleKey: 'connectors.page_title'
            }}
            table={{
                rowGroups: [{key: 'connectors', items}],
                rowIndexKey: 'id',
                isLoading: isLoading,
                errorMessage: error?.message,
                columns: [
                    {
                        title: t('connectors.connector_id'),
                        dataIndex: 'connector_id',
                        colSpan: 12,
                        render: ({id, connectorId}) => (
                            <ItemPreview title={connectorId}
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
                    <CreateConnectorModal
                        onClose={(createdTopic) => {
                            if (createdTopic) {
                                void mutate()
                                toast.success(t('topics.topic_created'))
                                navigate(buildDetailsPathname(createdTopic.id), {replace: true});
                                return;
                            }

                            navigate({pathname: connectorsPathname, search})
                        }}/>
                )
            }
        />
    )
}
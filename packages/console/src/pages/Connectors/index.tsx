import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import { ConnectorResponse} from "@astoniq/norm-schema";
import {ItemPreview} from "../../components/ItemPreview";
import {toast} from "react-hot-toast";
import {CreateConnectorModal} from "./CreateConnectorModal";
import {DangerousRaw} from "../../components/DangerousRaw";

const apiPathname = 'connectors'
const connectorsPathname = '/connectors';
const createConnectorPathname = `${connectorsPathname}/create`;


const buildDetailsPathname = (id: string) => `${connectorsPathname}/${id}`;

export const Connectors = () => {

    const api = useProjectApi();

    const {navigate, match} = useProjectPathname();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const {search} = useLocation();

    const isCreating = match(createConnectorPathname);

    const {getTo} = useProjectPathname();

    const {data = [], error, mutate} = useSWR<ConnectorResponse[], RequestError>(apiPathname, swrOptions)

    const isLoading = !data && !error

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
                rowGroups: [{key: 'connectors', items: data}],
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
                    {
                        title: t('connectors.connector_type'),
                        dataIndex: 'connector_type',
                        colSpan: 12,
                        render: ({id, type}) => (
                            <DangerousRaw >{type}</DangerousRaw>
                        )
                    },
                    {
                        title: t('connectors.connector_target'),
                        dataIndex: 'connector_target',
                        colSpan: 12,
                        render: ({id, target}) => (
                            <DangerousRaw >{target}</DangerousRaw>
                        )
                    },
                ],
                onRetry: async () => mutate(undefined, true)
            }}
            widgets={
                isCreating && (
                    <CreateConnectorModal
                        onClose={(createdConnector) => {
                            if (createdConnector) {
                                void mutate()
                                toast.success(t('topics.topic_created'))
                                navigate(buildDetailsPathname(createdConnector.id), {replace: true});
                                return;
                            }

                            navigate({pathname: connectorsPathname, search})
                        }}/>
                )
            }
        />
    )
}
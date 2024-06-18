import {useTenantApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useTenantPathname} from "../../hooks/use-tenant-pathname.ts";
import {CreateResourceModal} from "./CreateResourceModal";
import {useLocation} from "react-router-dom";
import {toast} from "react-hot-toast";
import {useTranslation} from "react-i18next";

const apiPathname = 'resources'
const resourcesPathname = '/resources';
const createResourcePathname = `${resourcesPathname}/create`;

export const Resources = () => {

    const api = useTenantApi();

    const {navigate, match} = useTenantPathname();

    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()

    const isCreating = match(createResourcePathname);

    const {search} = useLocation();

    const {data, error} = useSWR(apiPathname, swrOptions)

    const isLoading = !data && !error

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
                rowGroups: [{key: 'resources', data}],
                rowIndexKey: 'id',
                isLoading: isLoading,
                errorMessage: error?.message,
                columns: [
                    {
                        title: '',
                        dataIndex: 'roles',
                        colSpan: 12,
                        render: ({name}) => (
                            <div>{name}</div>
                        )
                    }
                ]
            }}
            widgets={
                isCreating && (
                    <CreateResourceModal
                        onClose={(createdResource) => {
                            if (createdResource) {
                                toast.success(t('resources.resource_created'))
                            }

                            navigate({pathname: resourcesPathname, search})
                        }}/>
                )
            }
        />
    )
}
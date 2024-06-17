import {useTenantApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";

const apiPathname = 'resources'

export const Dashboard = () => {

    const api = useTenantApi()

    const swrOptions = useSwrOptions(api);

    const {data, error} = useSWR(apiPathname, swrOptions)

    const isLoading = !data && !error

    return (
        <ListPage
            title={{
                title: 'general.add',
                subtitle: 'general.add'
            }}
            createButton={{
                title: 'general.add',
                onClick: () => console.log('1')
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
            }
            }/>
    )
}
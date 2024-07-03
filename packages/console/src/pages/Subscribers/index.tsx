import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../hooks/use-search-parameters.ts";
import {buildUrl} from "../../utils";
import {defaultPaginationPageSize, SubscriberPaginationResponse} from "@astoniq/norm-schema";
import {Breakable} from "../../components/Breakable";

const apiPathname = 'subscribers'

const pageSize = defaultPaginationPageSize;

export const Subscribers = () => {

    const api = useProjectApi();


    const swrOptions = useSwrOptions(api);

    const {t} = useTranslation()



    const [{page}, updateSearchParameters] = useSearchParameters({
        page: 1,
    })

    const url = buildUrl(apiPathname, {
        page: String(page),
        page_size: String(pageSize)
    })


    const {data, error, mutate} = useSWR<SubscriberPaginationResponse, RequestError>(url, swrOptions)

    const isLoading = !data && !error

    const {items = [], totalCount} = data ?? {}

    return (
        <ListPage
            title={{
                title: 'subscribers.title',
                subtitle: 'subscribers.subtitle'
            }}
            pageMeta={{
                titleKey: 'subscribers.page_title'
            }}
            table={{
                rowGroups: [{key: 'subscribers', items}],
                rowIndexKey: 'id',
                isLoading: isLoading,
                errorMessage: error?.message,
                columns: [
                    {
                        title: t('subscribers.subscriber_id'),
                        dataIndex: 'subscriber_id',
                        colSpan: 12,
                        render: ({subscriberId}) => (
                            <Breakable>{subscriberId}</Breakable>
                        )
                    },
                    {
                        title: t('subscribers.subscriber_name'),
                        dataIndex: 'subscriber_name',
                        colSpan: 12,
                        render: ({name}) => (
                            <Breakable>{name}</Breakable>
                        )
                    },
                    {
                        title: t('subscribers.subscriber_username'),
                        dataIndex: 'subscriber_username',
                        colSpan: 12,
                        render: ({username}) => (
                            <Breakable>{username}</Breakable>
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
        />
    )
}
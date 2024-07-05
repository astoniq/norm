import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import useSWR from "swr";
import {ListPage} from "../../components/ListPage";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../hooks/use-search-parameters.ts";
import {buildUrl} from "../../utils";
import {
    defaultPaginationPageSize,
    NotificationPaginationResponse,
} from "@astoniq/norm-schema";
import {Breakable} from "../../components/Breakable";

const apiPathname = 'notifications'

const pageSize = defaultPaginationPageSize;

export const Notifications = () => {

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

    const {data, error, mutate} = useSWR<NotificationPaginationResponse, RequestError>(url, swrOptions)

    const isLoading = !data && !error

    const {items = [], totalCount} = data ?? {}

    return (
        <ListPage
            title={{
                title: 'notifications.title',
                subtitle: 'notifications.subtitle'
            }}
            pageMeta={{
                titleKey: 'notifications.page_title'
            }}
            table={{
                rowGroups: [{key: 'notifications', items}],
                rowIndexKey: 'id',
                isLoading: isLoading,
                errorMessage: error?.message,
                columns: [
                    {
                        title: t('notifications.notification_id'),
                        dataIndex: 'notification_id',
                        colSpan: 12,
                        render: ({notificationId}) => (
                            <Breakable>{notificationId}</Breakable>
                        )
                    },
                    {
                        title: t('notifications.notification_status'),
                        dataIndex: 'notification_status',
                        colSpan: 12,
                        render: ({status}) => (
                            <Breakable>{status}</Breakable>
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
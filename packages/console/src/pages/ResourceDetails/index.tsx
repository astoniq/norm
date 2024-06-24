import {DetailsPage} from "../../components/DetailsPage";
import {useProjectPathname} from "../../hooks/use-project-pathname.ts";
import useSWR from "swr";
import {ResourceResponse} from "@astoniq/norm-schema";
import {RequestError, useProjectApi} from "../../hooks/use-api.ts";
import {useSwrOptions} from "../../hooks/use-swr-options.ts";
import {Outlet, useParams} from "react-router-dom";
import {PageMeta} from "../../components/PageMeta";
import {DetailsPageHeader} from "../../components/DetailsPageHeader";
import {ResourceDetailsOutletContext} from "./types.ts";
import {useState} from "react";


export function ResourceDetails() {

    const {getTo} = useProjectPathname();

    const api = useProjectApi();

    const swrOptions = useSwrOptions(api);

    const {id} = useParams()

    const {data, error, mutate} = useSWR<ResourceResponse, RequestError>(`resources/${id}`, swrOptions)

    const isLoading = !data && !error

    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <DetailsPage
            backLink={getTo('/resources')}
            backLinkTitle={'resource_details.back_to_resources'}
            isLoading={isLoading}
            error={error}
            onRetry={mutate}
        >
            <PageMeta titleKey={'resource_details.page_title'}/>
            {data && (
                <>
                <DetailsPageHeader title={data.resourceId}></DetailsPageHeader>
                    <Outlet
                    context={{
                        resource: data,
                        isDeleting,
                        onResourceUpdated: (resource) => {
                            if (resource) {
                                void mutate(resource)
                            }
                            void mutate()
                        }
                    } satisfies ResourceDetailsOutletContext}
                    />
                </>
            )}
        </DetailsPage>
    )
}
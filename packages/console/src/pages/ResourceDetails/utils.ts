import {ResourceResponse, PatchResource} from "@astoniq/norm-schema";
import {ResourceDetailsFormType} from "./types.ts";
import {conditional} from "@astoniq/essentials";

export const resourceDetailsParser = {
    toLocalForm: (data: ResourceResponse): ResourceDetailsFormType => {

        const {
            resourceId,
            config: {url, headers}
        } = data

        const headerFields = conditional(
            headers && Object.entries(headers).map(([key, value]) => ({key, value}))
        )

        return {
            resourceId,
            url,
            headers: headerFields?.length ? headerFields : [{key: '', value: ''}]
        }
    },
    toRemoteModel: (data: ResourceDetailsFormType): PatchResource => {
        const {
            resourceId,
            url,
            headers
        } = data

        const headersObject = conditional(
            headers &&
            Object.fromEntries(
                headers.filter(({key, value}) => key && value).map(({key, value}) => [key, value])
            )
        );

        return {
            resourceId,
            config: {
                url,
                headers: headersObject
            }
        }
    }
}
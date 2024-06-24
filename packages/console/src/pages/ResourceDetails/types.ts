import {CreateResource, Resource, ResourceResponse} from "@astoniq/norm-schema";

export type ResourceDetailsOutletContext = {
    resource: ResourceResponse
    isDeleting: boolean;
    onResourceUpdated: (resource?: Resource) => void
}

export type HeaderField = {
    key: string;
    value: string;
}

export type ResourceDetailsFormType = Pick<CreateResource, 'resourceId'> & {
    url: string;
    headers?: HeaderField[]
}
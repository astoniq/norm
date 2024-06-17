import ky, {KyInstance, KyResponse} from "ky";
import {useTranslation} from "react-i18next";
import {NormErrorCode} from "@astoniq/norm-phrase";
import {useConfirmModal} from "./use-confirm-modal.ts";
import {useCallback, useContext, useMemo} from "react";
import {toast} from 'react-hot-toast';
import {requestTimeout} from "../constants";
import {conditionalArray} from "@astoniq/essentials";
import {tenantIdHeaderKey} from '@astoniq/norm-schema'
import {TenantContext} from "../providers/TenantProvider";

export type RequestErrorBody<T = unknown> = {
    message: string;
    data: T;
    code: NormErrorCode;
    details?: string;
};

export class RequestError extends Error {
    constructor(
        public readonly status: number,
        public readonly body?: RequestErrorBody
    ) {
        super('Request error occurred.');
    }
}

export type StaticApiProps = {
    hideErrorToast?: boolean | NormErrorCode[],
    prefixUrl?: string,
    headers?: Record<string, string>
}

const useGlobalRequestErrorHandler = (toastDisabledErrorCodes?: NormErrorCode[]) => {

    const {show} = useConfirmModal()

    const {t} = useTranslation(undefined, {keyPrefix: 'console'});

    const handleError = useCallback(
        async (response: KyResponse) => {
            const fallbackErrorMessage = t('errors.unknown_server_error');

            try {
                const data: RequestErrorBody = await response.clone().json();

                if (toastDisabledErrorCodes?.includes(data.code)) {
                    return;
                }
                toast.error([data.message, data.details].join('\n') || fallbackErrorMessage);
            } catch {
                toast.error(fallbackErrorMessage);
            }
        }, [t, toastDisabledErrorCodes, show]
    )

    return {
        handleError
    }
}

export const useStaticApi = ({
                                 prefixUrl = '/api',
                                 hideErrorToast = false,
                                 headers = {}
                             }: StaticApiProps): KyInstance => {

    const {i18n} = useTranslation(undefined, {keyPrefix: 'console'})

    // Disable global error handling if `hideErrorToast` is true.
    const disableGlobalErrorHandling = hideErrorToast === true

    // Disable toast for specific error codes.
    const toastDisabledErrorCodes = Array.isArray(hideErrorToast) ? hideErrorToast : undefined;

    const {handleError} = useGlobalRequestErrorHandler(toastDisabledErrorCodes);

    return useMemo(
        () => ky.create({
            prefixUrl,
            timeout: requestTimeout,
            hooks: {
                beforeError: conditionalArray(
                    !disableGlobalErrorHandling && (async (error) => {
                        await handleError(error.response)
                        return error
                    })
                ),
                beforeRequest: [
                    async (request) => {
                        request.headers.set('Accept-Language', i18n.language);

                        for (const key in headers) {
                            request.headers.set(key, headers[key])
                        }

                    }
                ]
            }
        }), [prefixUrl, disableGlobalErrorHandling, handleError, i18n.language, headers]
    )
}

export const useTenantApi = (props: Omit<StaticApiProps, 'headers' | 'prefixUrl'> = {}) => {

    const currentTenantId = useContext(TenantContext)

    const headers = useMemo(
        () => ({
            [tenantIdHeaderKey]: currentTenantId
        }), [currentTenantId]
    )

    return useStaticApi({...props, headers})
}
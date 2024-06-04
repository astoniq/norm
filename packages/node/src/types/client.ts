import { AxiosError } from 'axios';

export type RetryConfig = {
    initialDelay?: number;
    waitMin?: number;
    waitMax?: number;
    retryMax?: number;
    retryCondition?: (err: AxiosError) => boolean;
}

export type NormConfig = {
    backendUrl: string;
    clientKey: string;
    retryConfig?: RetryConfig
}
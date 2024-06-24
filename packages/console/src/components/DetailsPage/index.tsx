import {To} from "react-router-dom";
import {NormTranslationCode} from "@astoniq/norm-phrase";
import {RequestError} from "../../hooks/use-api.ts";
import {ReactNode} from "react";
import classNames from "classnames";

import styles from './index.module.css'
import {TextLink} from "../TextLink";
import {BackIcon} from "../../icons/BackIcon.tsx";
import {DynamicT} from "../DynamicT";
import {DetailsPageSkeleton} from "../DetailsPageSkeleton";
import {RequestDataError} from "../RequestDataError";

export type DetailsPageProps = {
    backLink: To;
    backLinkTitle: NormTranslationCode;
    isLoading?: boolean;
    error?: RequestError;
    onRetry?: () => void;
    children: ReactNode;
    className?: string;
}

export function DetailsPage(
    {
        backLink,
        backLinkTitle,
        isLoading,
        error,
        onRetry,
        children,
        className
    }: DetailsPageProps
) {
    return (
        <div className={classNames(styles.container, className)}>
            <TextLink to={backLink} icon={<BackIcon/>} className={styles.backLink}>
                <DynamicT forKey={backLinkTitle}/>
            </TextLink>
            {isLoading ? (
                <DetailsPageSkeleton/>
            ) : error ? (
                <RequestDataError error={error} onRetry={onRetry}/>
            ) : (children)}
        </div>
    )
}
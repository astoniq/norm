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
import {PageMeta, PageMetaProps} from "../PageMeta";

export type DetailsPageProps = {
    backLink: To;
    backLinkTitle: NormTranslationCode;
    isLoading?: boolean;
    error?: RequestError;
    onRetry?: () => void;
    children: ReactNode;
    className?: string;
    pageMeta?: PageMetaProps;
}

export function DetailsPage(
    {
        backLink,
        pageMeta,
        backLinkTitle,
        isLoading,
        error,
        onRetry,
        children,
        className
    }: DetailsPageProps
) {
    return (
        <div className={classNames(styles.page, className)}>
            {pageMeta && <PageMeta {...pageMeta}/>}
            <TextLink mode={'ripple'} to={backLink} icon={<BackIcon/>} className={styles.backLink}>
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
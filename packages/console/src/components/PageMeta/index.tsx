import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";

export type PageMetaProps = {
    readonly titleKey: string
}

export function PageMeta({titleKey}: PageMetaProps) {
    const {t} = useTranslation(undefined, {keyPrefix: 'console'});
    const title = t(titleKey)
    return <Helmet title={title}></Helmet>
}
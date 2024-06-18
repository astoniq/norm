import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet-async";

export type PageMetaProps = {
    readonly titleKey: string
}

export function PageMeta({titleKey}: PageMetaProps) {
    const {t} = useTranslation();
    const title = t(titleKey)
    return <Helmet title={title}></Helmet>
}
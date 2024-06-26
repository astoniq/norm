import {ReactNode} from "react";
import {NormTranslationCode} from "@astoniq/norm-phrase";

import styles from './index.module.css'
import {DynamicT} from "../DynamicT";

export type DetailsPageContentProps = {
    title: NormTranslationCode;
    description?: NormTranslationCode;
    children: ReactNode
}

export function DetailsPageContent(
    {
        title,
        description,
        children
    }: DetailsPageContentProps
) {
    return (
        <div className={styles.content}>
            <div className={styles.info}>
                <div className={styles.title}>
                    <DynamicT forKey={title}/>
                </div>
                {description && (
                    <div className={styles.description}>
                        <DynamicT forKey={description}/>
                    </div>
                )}
            </div>
            <div className={styles.wrapper}>{children}</div>
        </div>
    )
}
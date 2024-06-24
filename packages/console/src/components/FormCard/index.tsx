import {NormTranslationCode} from "@astoniq/norm-phrase";
import {ReactNode} from "react";
import {FormCardLayout} from "../FormCardLayout";

import styles from './index.module.css'
import {DynamicT} from "../DynamicT";

export type FormCardProps = {
    title: NormTranslationCode;
    tag?: ReactNode;
    description?: NormTranslationCode;
    descriptionInterpolation?: Record<string, unknown>;
    children: ReactNode;
}

export function FormCard(
    {
        tag,
        title,
        description,
        descriptionInterpolation,
        children
    }: FormCardProps) {
    return (
        <FormCardLayout introduction={
            <>
                <div className={styles.title}>
                    <DynamicT forKey={title}/>
                    {tag}
                </div>
                {description && (
                    <div className={styles.description}>
                        <DynamicT forKey={description} interpolation={descriptionInterpolation}/>
                    </div>
                )}
            </>
        }>
            {children}
        </FormCardLayout>
    )
}
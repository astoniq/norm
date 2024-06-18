import {NormTranslationCode} from "@astoniq/norm-phrase";
import {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import classNames from "classnames";

import styles from './index.module.css'
import {DynamicT} from "../DynamicT";
import {Spacer} from "../Spacer";

export type FormFieldProps = {
    readonly title: NormTranslationCode;
    readonly description?: NormTranslationCode;
    readonly descriptionPosition?: 'top' | 'bottom';
    readonly children: ReactNode;
    readonly isRequired?: boolean;
    readonly isMultiple?: boolean;
    readonly className?: string;
    readonly headlineSpacing?: 'default' | 'large';
    readonly headlineClassName?: string;
}

export function FormField(
    {
        title,
        description,
        descriptionPosition = 'bottom',
        children,
        isMultiple,
        isRequired,
        className,
        headlineSpacing = 'default',
        headlineClassName
    }: FormFieldProps) {

    const {t} = useTranslation();

    return (
        <div className={classNames(styles.field, className)}>
            <div className={classNames(
                styles.headline,
                headlineSpacing === 'large' && styles.withLargeSpacing,
                headlineClassName
            )}>
                <div className={styles.title}>
                    <DynamicT forKey={title}/>
                    {isMultiple && (
                        <span className={styles.multiple}>{t('general.multiple_form_field')}</span>
                    )}
                </div>
                <Spacer/>
                {isRequired && <div className={styles.required}>{t('general.required')}</div>}
            </div>
            {description && descriptionPosition === 'top' && (
                <div className={classNames(styles.description, styles.top)}>
                    <DynamicT forKey={description}/>
                </div>
            )}
            {children}
            {description && descriptionPosition === 'bottom' && (
                <div className={classNames(styles.description, styles.top)}>
                    <DynamicT forKey={description}/>
                </div>
            )}
        </div>
    )
}
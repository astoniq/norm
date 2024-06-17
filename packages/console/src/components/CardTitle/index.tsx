import {NormTranslationCode} from "@astoniq/norm-phrase";
import classNames from "classnames";

import styles from './index.module.css';
import {DynamicT} from "../DynamicT";

export type CardTitleProps = {
    readonly title?: NormTranslationCode
    readonly subtitle?: NormTranslationCode,
    readonly size?: 'small' | 'medium' | 'large',
    readonly isWordWrapEnabled?: boolean;
    readonly className?: string;
}

export function CardTitle(
    {
        title = 'general.reminder',
        subtitle,
        size = 'large',
        isWordWrapEnabled = false,
        className
    }: CardTitleProps) {

    return (
        <div className={classNames(styles.container, styles[size], className)}>
            <div className={classNames(styles.title, !isWordWrapEnabled && styles.titleEllipsis)}>
                <DynamicT forKey={title}/>
            </div>
            {Boolean(subtitle) && (
                <div className={styles.subtitle}>
                    {subtitle && (
                        <span>
                                <DynamicT forKey={subtitle}/>
                            </span>
                    )}
                </div>
            )}
        </div>
    )
}
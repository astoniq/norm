import classNames from 'classnames';
import type { ReactNode } from 'react';
import type { To } from 'react-router-dom';
import { Link } from 'react-router-dom';

import styles from './index.module.css';

type Props = {
    readonly title: ReactNode;
    readonly subtitle?: ReactNode;
    readonly icon?: ReactNode;
    readonly to?: To;
    readonly size?: 'default' | 'compact';
    readonly suffix?: ReactNode;
    readonly toTarget?: HTMLAnchorElement['target'];
};

export function ItemPreview({ title, subtitle, icon, to, size = 'default', suffix, toTarget }: Props) {

    return (
        <div className={classNames(styles.item, styles[size])}>
            {icon}
            <div className={styles.content}>
                <div className={styles.meta}>
                    {to && (
                        <Link
                            className={classNames(styles.title, styles.withLink)}
                            to={to}
                            target={toTarget}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            {title}
                        </Link>
                    )}
                    {!to && <div className={styles.title}>{title}</div>}
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
                {suffix}
            </div>
        </div>
    );
}
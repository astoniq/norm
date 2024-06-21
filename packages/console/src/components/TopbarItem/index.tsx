import classNames from 'classnames';
import type { TFuncKey } from 'i18next';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import kebabCase from 'just-kebab-case';

import styles from './index.module.css';

type Props = {
    readonly icon?: ReactNode;
    readonly titleKey: TFuncKey<'translation'>;
    readonly isActive?: boolean;
};

export function TopbarItem({ icon, titleKey, isActive = false }: Props) {
    const { t } = useTranslation();

    const content = useMemo(
        () => (
            <>
                {icon && <div className={styles.icon}>{icon}</div>}
                <div className={styles.title}>{t(titleKey)}</div>
            </>
        ),
        [icon, t, titleKey]
    );

    return (
        <Link to={kebabCase(titleKey)} className={classNames(styles.row, isActive && styles.active)}>
            {content}
        </Link>
    );
}
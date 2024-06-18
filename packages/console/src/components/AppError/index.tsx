import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

type Props = {
    readonly title?: string;
    readonly errorCode?: string;
    readonly errorMessage?: string;
    readonly children?: ReactNode;
};

export function AppError({ title, errorCode, errorMessage,children }: Props) {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <label>{title ?? t('errors.something_went_wrong')}</label>
            <div className={styles.summary}>
        <span>
          {errorCode}
            {errorCode && errorMessage && ': '}
            {errorMessage}
        </span>
            </div>
            {children}
        </div>
    );
}
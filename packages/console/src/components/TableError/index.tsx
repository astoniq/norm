import {useTranslation} from "react-i18next";

import styles from './index.module.css'
import Button from "../Button";

export type TableErrorProps = {
    readonly title?: string;
    readonly content?: string;
    readonly onRetry?: () => void;
    readonly columns: number;
}

export function TableError({
                               title,
                               content,
                               onRetry,
                               columns
                           }: TableErrorProps) {

    const {t} = useTranslation()

    return (
        <tr>
            <td colSpan={columns}>
                <div className={styles.tableError}>
                    <div className={styles.title}>{title ?? t('errors.something_went_wrong')}</div>
                    <div className={styles.content}>{content ?? t('errors.unknown_server_error')}</div>
                    {onRetry && <Button title={'general.retry'} onClick={onRetry}/>}
                </div>
            </td>
        </tr>
    )
}
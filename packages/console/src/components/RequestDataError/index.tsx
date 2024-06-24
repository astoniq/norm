import {RequestError} from "../../hooks/use-api.ts";
import {useTranslation} from "react-i18next";
import Card from "../Card";
import styles from './index.module.css'
import classNames from "classnames";
import Button from "../Button";

export type RequestDataErrorProps = {
    error: RequestError;
    onRetry?: () => void;
    className?: string;
}

export function RequestDataError(
    {
        error,
        onRetry,
        className
    }: RequestDataErrorProps
) {
    const {t} = useTranslation();

    const errorMessage = error.body?.message ?? error.message
    const isNotFoundError = error.status === 404

    return (
        <Card className={classNames(styles.error, className)}>
            <div className={styles.title}>
                {t(isNotFoundError ? 'errors.not_found' : 'errors.something_went_wrong')}
            </div>
            <div className={styles.content}>{errorMessage}</div>
            {onRetry && <Button title={'general.retry'} onClick={onRetry}/>}
        </Card>
    )
}
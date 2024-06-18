import {useTranslation} from "react-i18next";
import {useCacheValue} from "../../hooks/use-cache-value.ts";
import classNames from "classnames";
import ReactPaginate from 'react-paginate';

import styles from './index.module.css'
import Button from "../Button";
import {PreviousIcon} from "../../icons/PreviousIcon.tsx";
import {NextIcon} from "../../icons/NextIcon.tsx";
import {DangerousRaw} from "../DangerousRaw";

export type PaginationProps = {
    readonly page: number;
    readonly totalCount?: number;
    readonly pageSize: number;
    readonly className?: string;
    readonly mode?: 'normal' | 'pico';
    readonly onChange?: (pageIndex: number) => void;
}

export function Pagination({
                               page,
                               totalCount,
                               pageSize,
                               className,
                               mode = 'normal',
                               onChange
                           }: PaginationProps) {

    const {t} = useTranslation()

    const cachedTotalCount = useCacheValue(totalCount) ?? 0;

    const pageCount = Math.ceil(cachedTotalCount / pageSize);

    if (pageCount <= 1) {
        return null;
    }

    const min = (page - 1) * pageSize + 1;
    const max = Math.min(page * pageSize, cachedTotalCount);
    const isPicoMode = mode === 'pico';

    return (
        <div className={classNames(styles.container, isPicoMode && styles.pico, className)}>
            <div className={styles.positionInfo}>
                {t('general.page_info', {min, max, total: cachedTotalCount})}
            </div>
            <ReactPaginate
                className={styles.pagination}
                pageCount={pageCount}
                forcePage={page - 1}
                pageLabelBuilder={pageNumber => (
                    <Button
                        type={pageNumber === page ? 'outline' : 'default'}
                        className={classNames(styles.button, pageNumber === page && styles.active)}
                        size={'small'}
                    >
                        <DangerousRaw>{pageNumber}</DangerousRaw>
                    </Button>
                )}
                previousLabel={
                    <Button className={styles.button}
                            size={'small'}
                            icon={<PreviousIcon/>}
                            disabled={page === 1}/>
                }
                nextLabel={
                    <Button className={styles.button}
                            size={'small'}
                            icon={<NextIcon/>}
                            disabled={page === pageCount}/>
                }
                breakLabel={
                    <Button className={styles.button}
                            size={'small'}>
                        <DangerousRaw>...</DangerousRaw>
                    </Button>
                }
                disabledClassName={styles.disabled}
                pageRangeDisplayed={isPicoMode ? -1 : undefined}
                marginPagesDisplayed={isPicoMode ? 0 : undefined}
                onPageChange={({selected}) => {
                    onChange?.(selected + 1)
                }}/>
        </div>
    )
}
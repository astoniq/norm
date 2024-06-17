import styles from './index.module.css'
import classNames from "classnames";

export type TableSkeletonProps = {
    readonly columnSpans: number[];
    readonly isCompact?: boolean;
}

export function TableSkeleton({
                                  columnSpans,
                                  isCompact
                              }: TableSkeletonProps) {
    if (isCompact) {
        return (
            <>
                {Array.from({length: 2}).map((_, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                        {columnSpans.map((colSpan, columnIndex) => (
                            <td key={columnIndex} colSpan={colSpan}>
                                <div className={classNames(styles.rect, styles.shimmering)}/>
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        )
    }

    return (
        <>
            {Array.from({length: 2}).map((_, rowIndex) => (
                <tr key={`row-${rowIndex}`} className={styles.row}>
                    {columnSpans.map((colSpan, columnIndex) => (
                        <td key={columnIndex} colSpan={colSpan}>
                            <div className={classNames(styles.rect, styles.shimmering)}/>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}
import {FieldPath, FieldValues} from "react-hook-form";
import {Column, RowGroup} from "./types.ts";
import {Fragment, ReactNode} from "react";
import {Pagination, PaginationProps} from "../Pagination";
import classNames from "classnames";

import styles from './index.module.css';
import {OverlayScrollbar} from "../OverlayScrollbar";
import {TableSkeleton} from "../TableSkeleton";
import {TableError} from "../TableError";
import {TableEmpty} from "../TableEmpty";
import {conditional} from "@astoniq/essentials";

export type TableProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
    = {
    readonly rowGroups: Array<RowGroup<TFieldValues>>;
    readonly columns: Array<Column<TFieldValues>>;
    readonly rowIndexKey: TName;
    readonly filter?: ReactNode;
    readonly isRowHoverEffectDisabled?: boolean;
    readonly isRowClickable?: (row: TFieldValues) => boolean;
    readonly rowClickHandler?: (row: TFieldValues) => void;
    readonly rowClassName?: (row: TFieldValues, index: number) => string | undefined;
    readonly className?: string;
    readonly headerTableClassName?: string;
    readonly bodyTableWrapperClassName?: string;
    readonly isLoading?: boolean;
    readonly pagination?: PaginationProps;
    readonly placeholder?: ReactNode;
    readonly loadingSkeleton?: ReactNode;
    readonly errorMessage?: string;
    readonly hasBorder?: boolean;
    readonly onRetry?: () => void;
    readonly footer?: ReactNode;
}

export function Table<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
      rowGroups,
      columns,
      rowIndexKey,
      footer,
      filter,
      isRowHoverEffectDisabled = false,
      rowClickHandler,
      isRowClickable = () => Boolean(rowClickHandler),
      rowClassName,
      className,
      headerTableClassName,
      bodyTableWrapperClassName,
      isLoading,
      pagination,
      placeholder,
      loadingSkeleton,
      errorMessage,
      hasBorder,
      onRetry
  }: TableProps<TFieldValues, TName>) {

    const totalColspan = columns.reduce((result, {colSpan}) => {
        return result + (colSpan ?? 1)
    }, 0);

    const hasData = rowGroups.some(({data}) => data?.length);
    const hasError = !isLoading && !hasData && errorMessage;
    const isEmpty = !isLoading && !hasData && !errorMessage;
    const isLoaded = !isLoading && hasData;

    return (
        <div className={classNames(styles.container, className)}>
            <div className={classNames(styles.tableContainer, hasBorder && styles.hasBorder)}>
                {filter && (
                    <div className={styles.filterContainer}>
                        <div className={styles.filter}>{filter}</div>
                    </div>
                )}
                <table
                    className={classNames(
                        styles.headerTable,
                        filter && styles.hideTopBorderRadius,
                        headerTableClassName
                    )}>
                    <thead>
                    <tr>
                        {columns.map(({title, colSpan, dataIndex}) => (
                            <th key={dataIndex} colSpan={colSpan}>
                                {title}
                            </th>
                        ))}
                    </tr>
                    </thead>
                </table>
                <OverlayScrollbar
                    className={classNames(
                        styles.bodyTable,
                        isEmpty && styles.empty,
                        bodyTableWrapperClassName
                    )}
                >
                    <table>
                        <tbody>
                        {isLoading &&
                            (loadingSkeleton ?? (
                                <TableSkeleton
                                    isCompact={hasBorder}
                                    columnSpans={columns.map(({colSpan}) => colSpan ?? 1)}
                                />
                            ))}
                        {hasError && (
                            <TableError columns={columns.length} content={errorMessage} onRetry={onRetry}/>
                        )}
                        {isEmpty && (
                            <TableEmpty columns={columns.length}>{placeholder}</TableEmpty>
                        )}
                        {isLoaded &&
                            rowGroups.map(({key, label, labelRowClassName, labelClassName, data}) => (
                                <Fragment key={key}>
                                    {label && (
                                        <tr className={labelRowClassName}>
                                            <td colSpan={totalColspan} className={labelClassName}>
                                                {label}
                                            </td>
                                        </tr>
                                    )}
                                    {data?.map((row, rowIndex) => {
                                        const rowClickable = isRowClickable(row);

                                        const onClick = conditional(
                                            rowClickable && rowClickHandler &&
                                            (() => {
                                                rowClickHandler(row)
                                            }))

                                        return (
                                            <tr
                                                key={row[rowIndexKey]}
                                                className={classNames(
                                                    rowClickable && styles.clickable,
                                                    !isRowHoverEffectDisabled && styles.hoverEffect,
                                                    rowClassName?.(row, rowIndex)
                                                )}
                                                onClick={onClick}
                                            >
                                                {columns.map(({dataIndex, colSpan, className, render}) => (
                                                    <td key={dataIndex} colSpan={colSpan} className={className}>
                                                        {render(row, rowIndex)}
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </OverlayScrollbar>
            </div>
            <div className={styles.footer}>
                {footer ?? <div/>}
                {pagination && <Pagination className={styles.pagination} {...pagination}/>}
            </div>
        </div>
    )
}


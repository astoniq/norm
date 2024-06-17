import {FieldPath, FieldValues} from "react-hook-form";
import {CardTitle, CardTitleProps} from "../CardTitle";
import {PageMeta, PageMetaProps} from "../PageMeta";
import Button, {ButtonProps} from "../Button";
import {ReactNode} from "react";
import {Table, TableProps} from "../Table";
import classNames from "classnames";

import styles from './index.module.css'
import {PlusIcon} from "../../icons/PlusIcon.tsx";

export type CreateButtonProps = {
    title: ButtonProps['title'];
    onClick: ButtonProps['onClick']
}

export type ListPageProps<TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    readonly title: CardTitleProps;
    readonly pageMeta?: PageMetaProps;
    readonly createButton?: CreateButtonProps;
    readonly subHeader?: ReactNode;
    readonly table: TableProps<TFieldValues, TName>;
    readonly widgets?: ReactNode;
    readonly className?: string;
}

export function ListPage<TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
      title,
      pageMeta,
      createButton,
      subHeader,
      table,
      widgets,
      className
  }: ListPageProps<TFieldValues, TName>) {

    return (
        <div className={classNames(styles.container, className)}>
            {pageMeta && <PageMeta {...pageMeta}/>}
            <div className={styles.headline}>
                <CardTitle {...title}/>
                {createButton && <Button icon={<PlusIcon/>} type={'primary'} size={'large'} {...createButton}/>}
            </div>
            {subHeader}
            <Table className={styles.table} {...table}/>
            {widgets}
        </div>
    )
}
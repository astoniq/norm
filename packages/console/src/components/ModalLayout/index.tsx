import {ReactElement, ReactNode} from "react";
import {CardTitle, CardTitleProps} from "../CardTitle";
import Card from "../Card";
import classNames from "classnames";

import styles from './index.module.css'
import IconButton from "../IconButton";

export type ModalLayoutProps = {
    readonly children: ReactNode;
    readonly footer?: ReactNode;
    readonly onClose?: () => void;
    readonly className?: string;
    readonly size?: 'medium' | 'large' | 'xlarge',
    readonly headerIcon?: ReactElement;
} & Pick<CardTitleProps, 'title' | 'subtitle' | 'isWordWrapEnabled'>;

export function ModalLayout(
    {
        children,
        footer,
        onClose,
        className,
        size = 'medium',
        headerIcon,
        ...cardTitleProps
    }: ModalLayoutProps
) {
    return (
        <Card className={classNames(styles.container, styles[size])}>
            <div className={styles.header}>
                <div className={styles.iconAndTitle}>
                    {headerIcon}
                    <CardTitle isWordWrapEnabled={true} {...cardTitleProps}/>
                </div>
                {onClose && (
                    <IconButton onClick={onClose}>X</IconButton>
                )}
            </div>
            <div className={className}>{children}</div>
            {footer && <div className={styles.footer}>{footer}</div>}
        </Card>
    )
}
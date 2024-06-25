import type { MouseEvent, KeyboardEvent, ReactNode } from 'react';
import {onKeyDownHandler} from "../../utils/a11y.ts";

import classNames from 'classnames';

import styles from './index.module.css'

export type DropdownItemProps = {
    onClick?: (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
    className?: string;
    children: ReactNode;
    icon?: ReactNode;
    iconClassName?: string;
    type?: 'default' | 'danger';
}

export function DropdownItem({
                          onClick,
                          className,
                          children,
                          icon,
                          iconClassName,
                          type = 'default',
                      }: DropdownItemProps) {
    return (
        <div
            className={classNames(styles.item, styles[type], className)}
            role="menuitem"
            tabIndex={0}
            onMouseDown={(event) => {
                event.preventDefault();
            }}
            onKeyDown={onKeyDownHandler(onClick)}
            onClick={onClick}
        >
            {icon && <span className={classNames(styles.icon, iconClassName)}>{icon}</span>}
            {children}
        </div>
    );
}
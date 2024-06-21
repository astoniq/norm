import {ReactNode} from "react";
import {Link, To} from "react-router-dom";
import classNames from "classnames";

import styles from './index.module.css'
import {onKeyDownHandler} from "../../utils/a11y.ts";

export type TabNavItemProps = {
    isActive?: boolean;
    children: ReactNode;
    to?: To
    onClick?: () => void
}

export function TabNavItem(
    {
        children,
        isActive,
        to,
        onClick
    }: TabNavItemProps) {
    return (
        <div className={styles.item}>
            <div className={classNames(styles.link, isActive && styles.selected)}>
                {to ? (
                    <Link to={to}>{children}</Link>
                ) : (
                    <a role="tab" tabIndex={0} onKeyDown={onKeyDownHandler(onClick)} onClick={onClick}>
                        {children}
                    </a>
                )}
            </div>
        </div>
    )
}
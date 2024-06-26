import {ReactNode, useMemo, useState} from "react";
import {Link, To} from "react-router-dom";
import classNames from "classnames";

import styles from './index.module.css'

export type DetailsPageSidebarItemProps = {
    isActive?: boolean;
    externalLink?: string;
    link: To;
    modal?: (isOpen: boolean, onCancel: () => void) => ReactNode;
    title: string;
}

export function DetailsPageSidebarItem(
    {
        isActive,
        externalLink,
        link,
        modal,
        title
    }: DetailsPageSidebarItemProps
) {

    const [isOpen, setIsOpen] = useState(false);

    const content = useMemo(
        () => (
            <div className={styles.title}>{title}</div>
        ), [title]
    )

    if (modal) {
        return (
            <>
                <button
                    className={styles.row}
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    {content}
                </button>
                {modal(isOpen, () => {
                    setIsOpen(false);
                })}
            </>
        )
    }

    if (externalLink) {
        return (
            <a href={externalLink} target="_blank" className={styles.row} rel="noopener">
                {content}
            </a>
        );
    }

    return (
        <Link to={link} className={classNames(styles.row, isActive && styles.active)}>
            {content}
        </Link>
    );
}
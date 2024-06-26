import {ReactNode} from "react";
import {DetailsPageSidebarItem} from "../DetailsPageSidebarItem";
import {To} from "react-router-dom";

import styles from './index.module.css'

export type SidebarItem = {
    isActive?: boolean;
    externalLink?: string;
    link: string;
    modal?: (isOpen: boolean, onCancel: () => void) => ReactNode;
    title: string;
};

export type DetailsPageSidebarProps = {
    items: SidebarItem[]
    match: (pathname: string, exact?: boolean) => boolean;
    getTo: (to: To) => To;
}

export function DetailsPageSidebar(
    {
        items,
        match,
        getTo
    }: DetailsPageSidebarProps
) {
    return (
        <div className={styles.sidebar}>
            {items.map(
                ({title, externalLink, link, modal}) => (
                    <DetailsPageSidebarItem
                        key={title}
                        link={getTo(link)}
                        title={title}
                        externalLink={externalLink}
                        isActive={match(link)}
                        modal={modal}/>
                )
            )}
        </div>
    )
}
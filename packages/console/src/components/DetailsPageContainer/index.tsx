import {ReactNode} from "react";
import {DetailsPageHeader, DetailsPageHeaderProps} from "../DetailsPageHeader";

import styles from './index.module.css'
import classNames from "classnames";
import {DetailsPageSidebar, DetailsPageSidebarProps} from "../DetailsPageSidebar";

export type DetailsPageContainerProps = {
    header?: DetailsPageHeaderProps;
    sidebar: DetailsPageSidebarProps;
    content?: ReactNode;
    widgets?: ReactNode;
    className?: string;
}

export function DetailsPageContainer(
    {
        widgets,
        content,
        sidebar,
        header,
        className
    }: DetailsPageContainerProps
) {

    return (
        <div className={classNames(styles.container, className)}>
            {header && <DetailsPageHeader {...header}/>}
            <div className={classNames(styles.row, header && styles.withHeader)}>
                {sidebar && <DetailsPageSidebar {...sidebar}/>}
                {content}
            </div>
            {widgets}
        </div>
    )
}
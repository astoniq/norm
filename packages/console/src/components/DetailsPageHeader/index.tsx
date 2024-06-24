import {ReactNode} from "react";
import Card from "../Card";

import styles from './index.module.css'

export type DetailsPageHeaderProps = {
    title: ReactNode;
}

export function DetailsPageHeader(
    {
        title
    }: DetailsPageHeaderProps
) {

    return (
        <Card className={styles.header}>
            <div className={styles.metadata}>
                <div className={styles.name}>{title}</div>
            </div>
        </Card>
    )
}
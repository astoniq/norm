
import {Spacer} from "../Spacer";

import styles from './index.module.css';
import {Shimmering} from "../Shimmering";
import FormCardSkeleton from "../FormCardSkeleton";

export function DetailsPageSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Shimmering className={styles.icon} />
                <div className={styles.wrapper}>
                    <Shimmering className={styles.title} />
                    <Shimmering className={styles.tags} />
                </div>
                <Spacer />
                <Shimmering className={styles.button} />
            </div>
            <Shimmering className={styles.tabBar} />
            <FormCardSkeleton />
        </div>
    );
}
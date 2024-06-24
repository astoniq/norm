import { type ReactNode } from 'react';
import Card from "../Card";
import styles from './index.module.css';

type Props = {
    readonly introduction: ReactNode;
    readonly children: ReactNode;
};

export function FormCardLayout({ introduction, children }: Props) {
    return (
        <div className={styles.responsiveWrapper}>
            <Card className={styles.container}>
                <div className={styles.introduction}>{introduction}</div>
                <div className={styles.form}>{children}</div>
            </Card>
        </div>
    );
}

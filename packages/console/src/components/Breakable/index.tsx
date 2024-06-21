import {ReactNode} from "react";
import styles from './index.module.css';

type Props = {
    readonly children: ReactNode;
};

export function Breakable({ children }: Props) {
    return <div className={styles.breakable}>{children}</div>;
}
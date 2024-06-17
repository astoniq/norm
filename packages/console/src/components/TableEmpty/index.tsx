import {ReactNode} from "react";

import styles from './index.module.css'

export type TableEmptyProps = {
    readonly columns: number;
    readonly children: ReactNode;
}

export function TableEmpty({children, columns}: TableEmptyProps) {
    return (
        <tr>
            <td colSpan={columns} className={styles.tableEmpty}>
                <div className={styles.content}>
                    <div className={styles.topSpace}/>
                    {children}
                    <div className={styles.bottomSpace}/>
                </div>
            </td>
        </tr>
    )
}
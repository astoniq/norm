import { Outlet } from 'react-router-dom';
import classNames from 'classnames';

import styles from './index.module.css'
import {layoutClassNames} from "../../utils";

export const AppLayout = () => {
    return (
        <div className={styles.viewBox}>
            <div className={classNames(styles.container, layoutClassNames.pageContainer)}>
                <main className={classNames(styles.main, layoutClassNames.mainContent)}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
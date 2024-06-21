import { Outlet } from 'react-router-dom';

import styles from './index.module.css'

export const AppLayout = () => {
    return (
        <div className={styles.viewBox}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
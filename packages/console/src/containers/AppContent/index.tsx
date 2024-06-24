import styles from './index.module.css';
import {Outlet} from "react-router-dom";
import {OverlayScrollbar} from "../../components/OverlayScrollbar";
import {AppTopbar} from "../ConsoleSidebar";

export function AppContent() {

    return (
        <div className={styles.app}>
            <AppTopbar/>
            <div className={styles.content}>
                <OverlayScrollbar className={styles.overlayScrollbarWrapper}>
                    <div className={styles.main}>
                        <Outlet/>
                    </div>
                </OverlayScrollbar>
            </div>
        </div>
    )
}
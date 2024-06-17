import styles from './index.module.css';
import {Outlet} from "react-router-dom";
import {OverlayScrollbar} from "../../components/OverlayScrollbar";
import {AppSidebar} from "../ConsoleSidebar";

export function AppContent() {

    return (
        <div className={styles.app}>
            <div className={styles.content}>
                <AppSidebar/>
                <OverlayScrollbar className={styles.overlayScrollbarWrapper}>
                    <Outlet/>
                </OverlayScrollbar>
            </div>
        </div>
    )
}
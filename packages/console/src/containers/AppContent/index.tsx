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
                    <Outlet/>
                </OverlayScrollbar>
            </div>
        </div>
    )
}
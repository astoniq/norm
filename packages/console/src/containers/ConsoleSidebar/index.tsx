import {OverlayScrollbar} from "../../components/OverlayScrollbar";

import styles from './index.module.css';

export function AppSidebar() {

    return (
        <OverlayScrollbar className={styles.sidebar}>
            sidebar
        </OverlayScrollbar>
    )
}
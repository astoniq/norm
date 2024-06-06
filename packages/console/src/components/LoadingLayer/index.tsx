import {LoadingIcon} from "../../icons/LoadingIcon.tsx";
import styles from './index.module.css'

export const LoadingLayer = () => (
    <div className={styles.overlay}>
        <div className={styles.container}>
            <LoadingIcon className={styles.loadingIcon}/>
        </div>
    </div>
);
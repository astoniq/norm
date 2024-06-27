import styles from './index.module.css'
import {useTranslation} from "react-i18next";
import {PageMeta} from "../../components/PageMeta";

export function Dashboard() {

    const {t} = useTranslation()

    return (
        <div className={styles.container}>
            <PageMeta titleKey={'dashboard.title'}/>
            <div className={styles.header}>
                <div className={styles.title}>{t('dashboard.title')}</div>
                <div className={styles.subtitle}>{t('dashboard.description')}</div>
            </div>
        </div>
    )
}
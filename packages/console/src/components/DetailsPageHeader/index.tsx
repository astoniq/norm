import {ReactNode} from "react";
import Card from "../Card";

import styles from './index.module.css'
import {DropdownItemProps} from "../DropdownItem";
import {NormTranslationCode} from "@astoniq/norm-phrase";
import {ActionMenu, ActionMenuItem} from "../ActionMenu";
import {MoreIcon} from "../../icons/MoreIcon.tsx";
import {useTranslation} from "react-i18next";
import {DynamicT} from "../DynamicT";

export type MenuItem = {
    type?: DropdownItemProps['type'],
    title: NormTranslationCode;
    icon: ReactNode;
    onClick: () => void
}

export type DetailsPageHeaderProps = {
    title: ReactNode;
    actionMenuItems?: MenuItem[]
}

export function DetailsPageHeader(
    {
        title,
        actionMenuItems
    }: DetailsPageHeaderProps
) {

    const {t} = useTranslation()

    return (
        <Card className={styles.header}>
            <div className={styles.metadata}>
                <div className={styles.name}>{title}</div>
            </div>
            <div className={styles.operations}>
                {actionMenuItems && actionMenuItems.length > 0 && (
                    <ActionMenu
                        buttonProps={{icon: <MoreIcon/>, size: 'medium'}}
                        title={t('general.more_options')}
                    >
                        {actionMenuItems.map(({title, icon, type, onClick}) => (
                            <ActionMenuItem key={title} icon={icon} type={type} onClick={onClick}>
                                <DynamicT forKey={title}/>
                            </ActionMenuItem>
                        ))}
                    </ActionMenu>
                )}
            </div>
        </Card>
    )
}
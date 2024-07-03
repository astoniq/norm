import {ReactNode} from "react";
import Card from "../Card";

import styles from './index.module.css'
import {DropdownItemProps} from "../DropdownItem";
import {NormTranslationCode} from "@astoniq/norm-phrase";
import {ActionMenu, ActionMenuItem} from "../ActionMenu";
import {MoreIcon} from "../../icons/MoreIcon.tsx";
import {useTranslation} from "react-i18next";
import {DynamicT} from "../DynamicT";
import CopyToClipboard from "../CopyToClipboard";
import {Tag, TagProps} from "../Tag";

export type MenuItem = {
    type?: DropdownItemProps['type'],
    title: NormTranslationCode;
    icon: ReactNode;
    onClick: () => void
}

type StatusTag = {
    status: TagProps['status'];
    text: NormTranslationCode;
};

export type Identifier = {
    name: string;
    value: string;
}

export type DetailsPageHeaderProps = {
    title: ReactNode;
    actionMenuItems?: MenuItem[];
    icon: ReactNode;
    identifier?: Identifier;
    statusTag?: StatusTag;
}

export function DetailsPageHeader(
    {
        icon,
        title,
        identifier,
        statusTag,
        actionMenuItems
    }: DetailsPageHeaderProps
) {

    const {t} = useTranslation()

    return (
        <Card className={styles.header}>
            <div className={styles.icon}>
                {icon}
            </div>
            <div className={styles.metadata}>
                <div className={styles.name}>{title}</div>
                <div className={styles.row}>
                    {statusTag && (
                        <>
                            <Tag type="state" status={statusTag.status}>
                                <DynamicT forKey={statusTag.text} />
                            </Tag>
                            <div className={styles.verticalBar} />
                        </>
                    )}
                    {identifier && (
                        <>
                            <div className={styles.text}>{identifier.name}</div>
                            <CopyToClipboard
                                className={styles.copyId}
                                style={{ maxWidth: `calc(${identifier.value.length}ch + 40px)` }}
                                valueStyle={{ width: 0 }}
                                size="small"
                                value={identifier.value}
                            />
                        </>
                    )}
                </div>
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
import {NormTranslationCode} from "@astoniq/norm-phrase";
import {ReactNode} from "react";
import ReactModal from "react-modal";

import styles from './index.module.css'
import {CardTitle} from "../CardTitle";
import {Spacer} from "../Spacer";
import IconButton from "../IconButton";
import {CloseIcon} from "../../icons/CloseIcon.tsx";

export type DrawerProps = {
    title?: NormTranslationCode;
    subtitle?: NormTranslationCode;
    isOpen: boolean;
    children: ReactNode;
    onClose?: () => void;
}

export function Drawer(
    {
        title,
        subtitle,
        isOpen,
        children,
        onClose
    }: DrawerProps
) {
    return (
        <ReactModal
            shouldCloseOnOverlayClick
            role="drawer"
            isOpen={isOpen}
            className={styles.content}
            overlayClassName={styles.overlay}
            closeTimeoutMS={300}
            onRequestClose={onClose}
        >
            <div className={styles.wrapper}>
                {title && (
                    <div className={styles.header}>
                        <CardTitle size="small" title={title} subtitle={subtitle} />
                        <Spacer />
                        <IconButton size="large" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                )}
                <div className={styles.body}>{children}</div>
            </div>
        </ReactModal>
    )
}
import ReactModal from "react-modal";
import {ReactNode} from "react";

import styles from './index.module.css'

export type ModalProps = {
    readonly isOpen?: boolean
    readonly onClose: () => void;
    readonly children: ReactNode;
}

export function Modal(
    {
        isOpen = true,
        onClose,
        children
    }: ModalProps) {
    return (
        <ReactModal isOpen={isOpen}
                    shouldCloseOnEsc={true}
                    className={styles.content}
                    overlayClassName={styles.overlay}
                    onRequestClose={() => {
                        onClose()
                    }}>
            {children}
        </ReactModal>

    )
}
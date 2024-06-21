import {ReactNode} from "react";
import {NormTranslationCode} from "@astoniq/norm-phrase";
import Button, {ButtonType} from "../Button";
import {ModalLayout, ModalLayoutProps} from "../ModalLayout";
import ReactModal from "react-modal";

import styles from './index.module.css'
import classNames from "classnames";

export type ConfirmModalProps = {
    readonly children: ReactNode;
    readonly className?: string;
    readonly title?: NormTranslationCode
    readonly subtitle?: NormTranslationCode,
    readonly confirmButtonType?: ButtonType;
    readonly confirmButtonText?: NormTranslationCode,
    readonly cancelButtonText?: NormTranslationCode,
    readonly isOpen: boolean;
    readonly isConfirmButtonDisabled?: boolean;
    readonly isCancelButtonVisible?: boolean;
    readonly size?: ModalLayoutProps['size'];
    readonly onCancel?: () => void;
    readonly onConfirm?: () => void;
}

export function ConfirmModal(
    {
        children,
        className,
        title = 'general.reminder',
        subtitle,
        confirmButtonType = 'error',
        confirmButtonText = 'general.confirm',
        cancelButtonText = 'general.cancel',
        isOpen,
        isConfirmButtonDisabled = false,
        isCancelButtonVisible = true,
        size,
        onCancel,
        onConfirm
    }: ConfirmModalProps) {
    return (
        <ReactModal isOpen={isOpen}
                    shouldCloseOnEsc={true}
                    className={styles.content}
                    overlayClassName={styles.overlay}
                    onRequestClose={onCancel}>
            <ModalLayout
                title={title}
                subtitle={subtitle}
                className={classNames(styles.content, className)}
                size={size}
                footer={
                    <>
                        {isCancelButtonVisible && onCancel && (
                            <Button title={cancelButtonText} onClick={onCancel}/>
                        )}
                        {onConfirm && (
                            <Button type={confirmButtonType}
                                    title={confirmButtonText}
                                    disabled={isConfirmButtonDisabled}
                                    onClick={onConfirm}/>
                        )}
                    </>
                }
                onClose={onCancel}
            >
                {children}
            </ModalLayout>
        </ReactModal>
    )
}
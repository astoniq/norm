import React, {createContext, JSX, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ConfirmModal, ConfirmModalProps} from "../../components/ConfirmModal";
import {noop, Nullable} from "@astoniq/essentials";

type ConfirmModalType = 'alert' | 'confirm';

type ConfirmModalState = Omit<ConfirmModalProps, 'onCancel' | 'onConfirm' | 'children'> & {
    ModalContent: string | (() => Nullable<JSX.Element>)
    type: ConfirmModalType;
}

type ShowConfirmModalProps = Omit<ConfirmModalState, 'isOpen' | 'type'> & {
    type?: ConfirmModalType
}

type ConfirmModalContextType = {
    show: (props: ShowConfirmModalProps) => Promise<[boolean, unknown?]>;
    confirm: (data?: unknown) => void;
    cancel: (data?: unknown) => void;
}

export const AppConfirmModalContext = createContext<ConfirmModalContextType>({
    show: async () => [true],
    confirm: noop,
    cancel: noop
})

export type Props = {
    readonly children?: React.ReactNode;
}

const defaultModalState: ConfirmModalState = {
    isOpen: false,
    type: 'confirm',
    ModalContent: () => null
}

export function AppConfirmModalProvider({children}: Props) {
    const [modalState, setModalState] = useState<ConfirmModalState>(defaultModalState)

    const resolver = useRef<(value: [result: boolean, data?: unknown]) => void>();

    const handleShow = useCallback(async ({ type = 'confirm', ...props }: ShowConfirmModalProps) => {
        resolver.current?.([false]);

        setModalState({
            isOpen: true,
            type,
            ...props,
        });

        return new Promise<[result: boolean, data?: unknown]>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const handleConfirm = useCallback((data?: unknown) => {
        resolver.current?.([true, data]);
        setModalState(defaultModalState);
    }, []);

    const handleCancel = useCallback((data?: unknown) => {
        resolver.current?.([false, data]);
        setModalState(defaultModalState);
    }, []);

    const contextValue = useMemo(
        () => ({
            show: handleShow,
            confirm: handleConfirm,
            cancel: handleCancel,
        }),
        [handleCancel, handleConfirm, handleShow]
    );

    useEffect(() => {
        const handlePathChange = () => {
            handleCancel();
        };

        window.addEventListener('popstate', handlePathChange);

        return () => {
            window.removeEventListener('popstate', handlePathChange);
        };
    }, [handleCancel]);

    const { ModalContent, type, ...restProps } = modalState;

    return (
        <AppConfirmModalContext.Provider value={contextValue}>
            {children}
            <ConfirmModal
                {...restProps}
                onConfirm={type === 'confirm' ? handleConfirm : undefined}
                onCancel={handleCancel}
            >
                {typeof ModalContent === 'string' ? ModalContent : <ModalContent />}
            </ConfirmModal>
        </AppConfirmModalContext.Provider>
    );
}
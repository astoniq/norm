import {DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode, RefObject, useRef} from "react";
import {HorizontalAlignment} from "../../types";
import usePosition from "../../hooks/use-position.ts";
import {OverlayScrollbar} from "../OverlayScrollbar";
import ReactModal from "react-modal";
import classNames from "classnames";

import styles from './index.module.css'
import {onKeyDownHandler} from "../../utils/a11y.ts";

export type DropdownProps = {
    children: ReactNode;
    title?: ReactNode;
    isOpen: boolean;
    onClose?: () => void;
    anchorRef: RefObject<HTMLElement>;
    className?: string;
    titleClassName?: string;
    isFullWidth?: boolean;
    horizontalAlign?: HorizontalAlignment;
    hasOverflowContent?: boolean;
    noOverlay?: true
}

export function Div(
    {
        children,
        ...rest
    }: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>) {
    return <div {...rest}>{children}</div>
}

export function Dropdown(
    {
        children,
        title,
        isOpen,
        onClose,
        anchorRef,
        isFullWidth,
        className,
        titleClassName,
        horizontalAlign = 'end',
        hasOverflowContent,
        noOverlay
    }: DropdownProps) {

    const overlayRef = useRef<HTMLDivElement>(null);

    const {position, positionState, mutate} = usePosition({
        verticalAlign: 'bottom',
        horizontalAlign,
        offset: {vertical: 4, horizontal: 0},
        anchorRef,
        overlayRef
    })

    const WrapperComponent = hasOverflowContent ? Div : OverlayScrollbar;

    return (
        <ReactModal isOpen={isOpen}
                    shouldCloseOnOverlayClick={true}
                    style={{
                        content: {
                            zIndex: 103,
                            width: isFullWidth && anchorRef.current ? anchorRef.current.getBoundingClientRect().width : "unset",
                            ...(!position && {opacity: 0}),
                            ...position
                        }
                    }}
                    shouldFocusAfterRender={false}
                    className={classNames(styles.content, positionState.verticalAlign === 'top' && styles.onTop)}
                    overlayClassName={styles.overlay}
                    overlayElement={noOverlay && ((_, content) => content)}
                    onRequestClose={event => {
                        event.stopPropagation();
                        onClose?.()
                    }}
                    onAfterOpen={mutate}>
            <div ref={overlayRef} className={styles.dropdownContainer}>
                {title && <div className={classNames(styles.title, titleClassName)}>{title}</div>}
                <WrapperComponent
                className={className}
                role={'menu'}
                tabIndex={0}
                onClick={onClose}
                onKeyDown={onKeyDownHandler({Enter: onClose, Esc: onClose})}
                >
                    {children}
                </WrapperComponent>
            </div>
        </ReactModal>
    )
}
import {ReactNode, useRef, useState} from "react";
import {HorizontalAlignment} from "../../types";
import Button, {ButtonProps} from "../Button";
import classNames from 'classnames';
import IconButton from "../IconButton";
import {Dropdown} from "../Dropdown";

import styles from './index.module.css'

export { DropdownItem as ActionMenuItem } from '../DropdownItem';

export type BaseProps = {
    children: ReactNode;
    title?: ReactNode;
    dropdownHorizontalAlign?: HorizontalAlignment;
    dropdownClassName?: string;
    isDropdownFullWidth?: boolean;
}

type Props =
    | (BaseProps & {
    buttonProps: ButtonProps;
})
    | (BaseProps & {
    icon: ReactNode;
    iconSize?: 'small' | 'medium' | 'large';
});

export function ActionMenu(props: Props) {
    const {
        children,
        title,
        dropdownHorizontalAlign,
        dropdownClassName,
        isDropdownFullWidth = false,
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const anchorReference = useRef(null);
    const hasButtonProps = 'buttonProps' in props;

    return (
        <div>
            {hasButtonProps && (
                <Button
                    {...props.buttonProps}
                    ref={anchorReference}
                    className={classNames(styles.actionMenuButton, props.buttonProps.className)}
                    onClick={() => {
                        setIsOpen(true);
                    }}
                />
            )}
            {!hasButtonProps && (
                <IconButton
                    ref={anchorReference}
                    size={props.iconSize}
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    {props.icon}
                </IconButton>
            )}
            <Dropdown
                title={title}
                titleClassName={styles.dropdownTitle}
                anchorRef={anchorReference}
                isOpen={isOpen}
                className={classNames(styles.content, dropdownClassName)}
                horizontalAlign={dropdownHorizontalAlign}
                isFullWidth={isDropdownFullWidth}
                onClose={() => {
                    setIsOpen(false);
                }}
            >
                {children}
            </Dropdown>
        </div>
    );
}
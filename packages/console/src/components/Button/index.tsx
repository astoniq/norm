import {ForwardedRef, HTMLProps, ReactNode} from "react";
import {NormTranslationCode} from "@astoniq/norm-phrase";
import classNames from "classnames";

import styles from './index.module.css';
import {DynamicT} from "../DynamicT";

export type ButtonType =
    | 'primary'
    | 'danger'
    | 'outline'
    | 'text'
    | 'default'
    | 'branding'
    | 'violet';

export type BaseButtonProps = Omit<HTMLProps<HTMLButtonElement>, 'type' | 'size' | 'title' | 'ref'> & {
    htmlType?: 'button' | 'submit' | 'reset';
    type?: ButtonType;
    size?: 'small' | 'medium' | 'large';
}

export type TitleButtonProps = BaseButtonProps & {
    title: NormTranslationCode;
    icon?: ReactNode;
}

type IconButtonProps = BaseButtonProps & {
    title?: NormTranslationCode;
    icon: ReactNode;
}

export type Props = TitleButtonProps | IconButtonProps;

export function Button(
    {
        htmlType = 'button',
        type = 'primary',
        size = 'medium',
        disabled,
        title,
        icon,
        className,
        ...rest
    }: Props,
    buttonRef: ForwardedRef<HTMLButtonElement>) {

    return (
        <button
            ref={buttonRef}
            type={htmlType}
            disabled={disabled}
            className={classNames(
                styles.button,
                styles[size],
                styles[type],
                icon && styles.withIcon,
                className
            )}
            {...rest}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {title && <span><DynamicT forKey={title}/></span>}
        </button>
    )
}
import {ForwardedRef, forwardRef, HTMLProps, ReactNode, useEffect, useRef, useState} from "react";
import {NormTranslationCode} from "@astoniq/norm-phrase";
import classNames from "classnames";

import styles from './index.module.css';
import {DynamicT} from "../DynamicT";
import {Ring} from "../Spinner";

export type ButtonType =
    | 'primary'
    | 'secondary'
    | 'error'
    | 'outline'
    | 'text'
    | 'default'

export type BaseButtonProps = Omit<HTMLProps<HTMLButtonElement>, 'type' | 'size' | 'title' | 'ref'> & {
    htmlType?: 'button' | 'submit' | 'reset';
    type?: ButtonType;
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    loadingDelay?: number;
}

export type TitleButtonProps = BaseButtonProps & {
    title: NormTranslationCode;
    icon?: ReactNode;
}

export type IconButtonProps = BaseButtonProps & {
    title?: NormTranslationCode;
    icon: ReactNode;
}

export type RawButtonProps = BaseButtonProps & {
    title?: NormTranslationCode;
    icon?: ReactNode;
    children: ReactNode;
}

export type ButtonProps = TitleButtonProps | IconButtonProps | RawButtonProps;

function Button(
    {
        htmlType = 'button',
        type = 'primary',
        size = 'medium',
        isLoading = false,
        loadingDelay = 500,
        disabled,
        title,
        icon,
        className,
        children,
        ...rest
    }: ButtonProps,
    buttonRef: ForwardedRef<HTMLButtonElement>) {

    const [showSpinner, setShowSpinner] = useState(false);

    const timerRef = useRef<number>();

    useEffect(() => {
        if (isLoading) {
            timerRef.current = window.setTimeout(() => {
                setShowSpinner(true);
            }, loadingDelay);
        }

        return () => {
            clearTimeout(timerRef.current);
            setShowSpinner(false);
        };
    }, [isLoading, loadingDelay]);


    return (
        <button
            ref={buttonRef}
            type={htmlType}
            disabled={isLoading || disabled}
            className={classNames(
                styles.button,
                styles[size],
                styles[type],
                icon && styles.withIcon,
                isLoading && styles.loading,
                className
            )}
            {...rest}>
            {showSpinner && <Ring className={styles.spinner} />}
            {icon && <span className={styles.icon}>{icon}</span>}
            {title && <span><DynamicT forKey={title}/></span>}
            {children}
        </button>
    )
}

export default forwardRef(Button);
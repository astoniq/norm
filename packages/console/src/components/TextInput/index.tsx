import {forwardRef, HTMLProps, ReactElement, Ref, useEffect, useImperativeHandle, useRef} from "react";
import {Nullable} from "@astoniq/essentials";
import classNames from "classnames";

import styles from './index.module.css'

export type TextInputProps = Omit<HTMLProps<HTMLInputElement>, 'size' | 'placeholder'> & {
    readonly error?: string | boolean | ReactElement;
    readonly icon?: ReactElement;
    readonly suffix?: ReactElement;
    readonly alwaysShowSuffix?: boolean;
    readonly isConfidential?: boolean;
    readonly inputContainerClassName?: string;
    readonly placeholder?: string | null;
}

function TextInput(
    {
        error,
        icon,
        suffix,
        alwaysShowSuffix = false,
        disabled,
        className,
        readOnly,
        placeholder,
        type = 'text',
        isConfidential = false,
        inputContainerClassName,
        ...rest
    }: TextInputProps, ref: Ref<Nullable<HTMLInputElement>>) {

    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => innerRef.current);

    useEffect(() => {
        if (type !== 'number') {
            return;
        }

        const input = innerRef.current;

        if (!input) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
        };

        input.addEventListener('wheel', handleWheel, {passive: false});

        return () => {
            input.removeEventListener('wheel', handleWheel);
        };

    }, [type])

    return (
        <div className={className}>
            <div className={classNames(
                styles.container,
                Boolean(error) && styles.error,
                isConfidential && type === 'text' && styles.hideTextContainerContent,
                icon && styles.withIcon,
                disabled && styles.disabled,
                readOnly && styles.readOnly,
                inputContainerClassName
            )}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <input type={type} {...rest} placeholder={placeholder ?? ''}
                       ref={innerRef} disabled={disabled} readOnly={readOnly}/>
            </div>
            {Boolean(error) && typeof error !== 'boolean' && (
                <div className={styles.errorMessage}>{error}</div>
            )}
        </div>
    )
}

export default forwardRef(TextInput);
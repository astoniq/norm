import {ForwardedRef, HTMLProps} from "react";

export type ButtonType =
    | 'primary'
    | 'secondary';

type BaseProps = Omit<HTMLProps<HTMLButtonElement>, 'type' | 'size' | 'title' | 'ref'> & {
    htmlType?: 'button' | 'submit' | 'reset';
    type?: ButtonType;
    size?: 'small' | 'medium' | 'large';
}

export type Props = BaseProps;

export function Button(
    {
        htmlType = 'button',
        type = 'primary',
        size = 'medium',
        disabled,
        ...rest
    }: Props,
    buttonRef: ForwardedRef<HTMLButtonElement>) {

    return (
        <button
            ref={buttonRef}
            type={htmlType}
            disabled={disabled}
            {...rest}>
        </button>
    )
}
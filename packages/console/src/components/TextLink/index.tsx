import {AnchorHTMLAttributes, ReactNode, useMemo} from "react";
import {Link, LinkProps} from "react-router-dom";
import classNames from "classnames";

import styles from './index.module.css'

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & Partial<LinkProps> & {
    icon?: ReactNode;
    isTrailingIcon?: boolean;
    mode?: 'content' | 'ripple'
    targetBlank?: boolean | 'noopener'
};

export function TextLink(
    {
        to,
        children,
        icon,
        isTrailingIcon = false,
        className,
        mode = 'content',
        targetBlank,
        ...rest
    }: TextLinkProps
) {

    const props = useMemo(
        () => ({
            ...rest,
            className: classNames(styles.link, styles[mode], isTrailingIcon && styles.trailingIcon, className),
            ...(Boolean(targetBlank) && {
                rel: typeof targetBlank === 'string' ? targetBlank : 'noopener norefererr',
                target: '_blank'
            })
        }),
        [className, isTrailingIcon, rest, targetBlank]
    )

    if (to) {
        return (
            <Link to={to} {...props}>
                {icon}
                {children}
            </Link>
        )
    }

    return (
        <a {...props}>
            {icon}
            {children}
        </a>
    )
}
import {ReactNode} from "react";

import styles from './index.module.css'
import classNames from "classnames";
import {conditional} from "@astoniq/essentials";

export type DetailsPageIconProps = {
    className?: string;
    size?: 'micro' | 'small' | 'medium' | 'large' | 'xlarge',
    name?: string;
    icon?: ReactNode;
}

export function DetailsPageIcon(
    {
        className,
        name,
        size = 'medium',
        icon
    }: DetailsPageIconProps
) {
    const wrapperClassName = classNames(styles.wrapper, styles[size], className);
    const iconClassName = classNames(styles.icon, styles[size]);
    const defaultColorPalette = [
        '#E74C3C',
        '#865300',
        '#FF8B64',
        '#FFC651',
        '#4EA254',
        '#2FA0FD',
        '#02C2E4',
        '#41BEA6',
        '#7958FF',
        '#ED73A3',
        '#DF96FA',
        '#ADAAB4',
    ];

    if (icon) {
        return (
            <div className={wrapperClassName}>
                {icon}
            </div>
        )
    }

    const color = conditional(name
        && defaultColorPalette[(name.codePointAt(0) ?? 0) % defaultColorPalette.length])

    return (
        <div className={wrapperClassName}>
            <div className={iconClassName} style={{backgroundColor: color}}>
                {name ? name.charAt(0).toUpperCase() : 0}
            </div>
        </div>
    )
}
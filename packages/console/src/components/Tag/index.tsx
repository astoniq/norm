import classNames from 'classnames';
import type {HTMLProps,  ReactNode} from 'react';

import {conditional} from "@astoniq/essentials";
import {SuccessIcon} from "../../icons/SuccessIcon.tsx";
import {FailedIcon} from "../../icons/FailedIcon.tsx";

import styles from './index.module.css';
import {JSX} from "react";
import {IconProps} from "../../types";

export type TagProps = Pick<HTMLProps<HTMLDivElement>, 'className' | 'onClick'> & {
    readonly type?: 'property' | 'state' | 'result';
    readonly status?: 'info' | 'success' | 'alert' | 'error';
    readonly variant?: 'plain' | 'outlined' | 'cell';
    readonly size?: 'medium' | 'small';
    readonly children: ReactNode;
};

const ResultIconMap: Partial<Record<Required<TagProps>['status'], (props: IconProps) => JSX.Element>> = {
    success: SuccessIcon,
    error: FailedIcon,
};

export function Tag({
                 type = 'property',
                 status = 'info',
                 variant = 'outlined',
                 size = 'medium',
                 className,
                 children,
                 ...rest
             }: TagProps) {
    const ResultIcon = conditional(type === 'result' && ResultIconMap[status]);

    return (
        <div
            className={classNames(styles.tag, styles[status], styles[variant], styles[size], className)}
            {...rest}
        >
            {type === 'state' && <div className={styles.icon} />}
            {ResultIcon && <ResultIcon className={classNames(styles.icon, styles.resultIcon)} />}
            {children}
        </div>
    );
}
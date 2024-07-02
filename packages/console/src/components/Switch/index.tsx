import classNames from 'classnames';
import type { HTMLProps, ReactElement, ReactNode, Ref } from 'react';
import { forwardRef } from 'react';

import {DynamicT} from '../DynamicT';

import styles from './index.module.css';
import {NormTranslationCode} from "@astoniq/norm-phrase";

type Props =
    | (Omit<HTMLProps<HTMLInputElement>, 'label'> & {
    readonly label?: ReactNode;
    readonly hasError?: boolean;
})
    | (HTMLProps<HTMLInputElement> & {
    readonly description: NormTranslationCode | ReactElement;
    readonly hasError?: boolean;
});

function Switch(props: Props, ref?: Ref<HTMLInputElement>) {
    const { label, hasError, ...rest } = props;

    return (
        <div className={classNames(styles.wrapper, hasError && styles.error)}>
            {'description' in props && (
                <div className={styles.label}>
                    <DynamicT forKey={props.description} />
                </div>
            )}
            {label && <div className={styles.label}>{label}</div>}
            <label className={styles.switch}>
                <input type="checkbox" {...rest} ref={ref} />
                <span className={styles.slider} />
            </label>
        </div>
    );
}

export default forwardRef<HTMLInputElement, Props>(Switch);
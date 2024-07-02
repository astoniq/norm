import classNames from 'classnames';
import type { JSXElementConstructor, Key, Ref } from 'react';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';

import styles from './index.module.css';
import {Falsy, Nullable} from "@astoniq/essentials";
import {RadioProps, Radio} from "../Radio";


type RadioElement =
    | {
    type: JSXElementConstructor<RadioProps>;
    props: RadioProps;
    key: Nullable<Key>;
}
    | Falsy;

type Props = {
    readonly name: string;
    readonly children: RadioElement | RadioElement[];
    readonly value?: string;
    readonly type?: 'card' | 'plain' | 'compact' | 'small';
    readonly className?: string;
    readonly onChange?: (value: string) => void;
};

function RadioGroup(
    { name, children, value, className, onChange, type = 'plain' }: Props,
    ref?: Ref<HTMLDivElement>
) {
    return (
        <div ref={ref} className={classNames(styles.radioGroup, styles[type], className)}>
            {Children.map(children, (child) => {
                if (!child || !isValidElement(child) || child.type !== Radio) {
                    console.error(
                        'Invalid child type for RadioGroup:',
                        child ? child.type : child,
                        '. Expecting Radio components.'
                    );

                    // Do not render child if not a valid Radio component
                    return null;
                }

                return cloneElement<RadioProps>(child, {
                    name,
                    isChecked: value === child.props.value,
                    onClick: () => {
                        onChange?.(child.props.value);
                    },
                    tabIndex: 0,
                    type,
                });
            })}
        </div>
    );
}

export default forwardRef<HTMLDivElement, Props>(RadioGroup);
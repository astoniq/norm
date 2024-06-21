import classNames from 'classnames';

import styles from './index.module.css';
import {ReactNode} from "react";


type Props = {
    readonly className?: string;
    readonly children: ReactNode;
};

function TabNav({ className, children }: Props) {
    return <nav className={classNames(styles.nav, className)}>{children}</nav>;
}

export default TabNav;
import styles from './index.module.css';
import classNames from "classnames";

export type ShimmeringProps = {
    className?: string;
}

export function Shimmering(
    {
        className
    }: ShimmeringProps) {
    return <div className={classNames(styles.shimmering, className)}/>;
}
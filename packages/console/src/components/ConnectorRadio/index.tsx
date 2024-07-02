import classNames from 'classnames';

import styles from './index.module.css';
import {ConnectorFactoryResponse} from "@astoniq/norm-schema";
import {DynamicT} from "../DynamicT";

type Props = {
    readonly data: ConnectorFactoryResponse;
};

export function ConnectorRadio({data: {name, description, type, target}}: Props) {
    return (
        <div className={styles.connector}>
            <div className={styles.content}>
                <div className={classNames(styles.name)}>
                    <DynamicT forKey={name}/>
                </div>
                <div className={styles.description}>
                    <DynamicT forKey={description}/>
                </div>
                <div className={styles.description}>
                    <span>type: {type}</span>
                </div>
                <div className={styles.description}>
                    <span>target: {target}</span>
                </div>
            </div>
        </div>
    );
}
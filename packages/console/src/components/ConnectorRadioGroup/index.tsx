import classNames from 'classnames';


import styles from './index.module.css';
import {ConnectorFactoryResponse} from "@astoniq/norm-schema";
import {ConnectorRadio} from "../ConnectorRadio";
import RadioGroup from "../RadioGroup";
import {Radio} from "../Radio";

export type ConnectorRadioGroupSize = 'medium' | 'large' | 'xlarge';

type Props = {
    readonly name: string;
    readonly value?: string;
    readonly connectors: Array<ConnectorFactoryResponse>;
    readonly size: ConnectorRadioGroupSize;
    readonly onChange: (groupId: string) => void;
};

export function ConnectorRadioGroup({ name, connectors, value, size, onChange }: Props) {
    return (
        <RadioGroup
            name={name}
            value={value}
            type="card"
            className={classNames(styles.connectorGroup, styles[size])}
            onChange={onChange}
        >
            {connectors.map((data) => (
                <Radio key={data.name} value={data.name}>
                    <ConnectorRadio data={data} />
                </Radio>
            ))}
        </RadioGroup>
    );
}
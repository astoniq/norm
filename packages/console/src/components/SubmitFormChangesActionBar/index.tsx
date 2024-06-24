import {NormTranslationCode} from "@astoniq/norm-phrase";
import classNames from "classnames";

import styles from './index.module.css'
import Button from "../Button";

export type Props = {
    isOpen: boolean;
    isSubmitting: boolean;
    onSubmit: () => Promise<void>;
    onDiscard: () => void;
    confirmText?: NormTranslationCode;
    className?: string;
}

export function SubmitFormChangesActionBar(
    {
        isOpen,
        isSubmitting,
        confirmText = 'general.save_changes',
        onSubmit,
        onDiscard,
        className
    }: Props
) {
    return (
        <div className={classNames(styles.container, isOpen && styles.active, className)}>
            <div className={styles.actionBar}>
                <Button
                    size={"medium"}
                    title={'general.discard'}
                    disabled={isSubmitting}
                    onClick={() => {
                        onDiscard()
                    }}/>
                <Button
                    isLoading={isSubmitting}
                    type={'primary'}
                    size={'medium'}
                    title={confirmText}
                    onClick={async () => onSubmit()}/>
            </div>
        </div>
    )
}
import {ReactNode} from "react";
import classNames from "classnames";

import styles from './index.module.css'
import {SubmitFormChangesActionBar} from "../SubmitFormChangesActionBar";

export type DetailsFormProps = {
     autoComplete?: string;
     isDirty: boolean;
     isSubmitting: boolean;
     onSubmit: () => Promise<void>;
     onDiscard: () => void;
     children: ReactNode;
}

export function DetailsForm(
    {
        autoComplete,
        isDirty,
        isSubmitting,
        onSubmit,
        onDiscard,
        children,
    }: DetailsFormProps) {

    return (
        <form
            className={classNames(styles.container, isDirty && styles.withSubmitActionBar)}
            autoComplete={autoComplete}>
            <div className={styles.fields}>{children}</div>
            <SubmitFormChangesActionBar
                isOpen={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onDiscard={onDiscard}
            />
        </form>
    )
}
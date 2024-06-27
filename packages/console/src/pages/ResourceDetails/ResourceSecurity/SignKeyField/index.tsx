import {useTranslation} from "react-i18next";
import {useProjectApi} from "../../../../hooks/use-api.ts";
import {useCallback, useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {FormField} from "../../../../components/FormField";
import {DynamicT} from "../../../../components/DynamicT";
import CopyToClipboard from "../../../../components/CopyToClipboard";
import Button from "../../../../components/Button";
import {ConfirmModal} from "../../../../components/ConfirmModal";
import {ResourceResponse} from "@astoniq/norm-schema";

import styles from './index.module.css'
import {RedoIcon} from "../../../../icons/RedoIcon.tsx";

type Props = {
    readonly resourceId: string;
    readonly signingKey: string;
    readonly onSigningKeyUpdated: (signingKey: string) => void;
};

function SigningKeyField({resourceId, signingKey, onSigningKeyUpdated}: Props) {
    const {t} = useTranslation();
    const api = useProjectApi();
    const [isRegenerateFormOpen, setIsRegenerateFormOpen] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const regenerateSigningKey = useCallback(
        async (silent = false) => {
            if (isRegenerating) {
                return;
            }
            setIsRegenerating(true);
            try {
                const {signingKey} = await api.patch(`resources/${resourceId}/signing-key`).json<ResourceResponse>();
                if (!silent) {
                    toast.success(t('resource_details.security.regenerated'));
                }
                setIsRegenerateFormOpen(false);
                onSigningKeyUpdated(signingKey);
            } finally {
                setIsRegenerating(false);
            }
        },
        [api, resourceId, isRegenerating, onSigningKeyUpdated, t]
    );

    useEffect(() => {
        if (!signingKey) {
            void regenerateSigningKey(true);
        }
    }, [regenerateSigningKey, signingKey]);

    return (
        <FormField
            title={"resource_details.security.signing_key"}
        >
            <CopyToClipboard
                hasVisibilityToggle
                value={signingKey}
                variant="border"
                className={styles.signingKeyField}
            />
            <Button
                type="text"
                size="small"
                icon={<RedoIcon/>}
                title="resource_details.security.regenerate"
                className={styles.regenerateButton}
                onClick={() => {
                    setIsRegenerateFormOpen(true);
                }}
            />
            <ConfirmModal
                isOpen={isRegenerateFormOpen}
                isLoading={isRegenerating}
                confirmButtonText="resource_details.security.regenerate"
                title="resource_details.security.regenerate_key_title"
                onCancel={async () => {
                    setIsRegenerateFormOpen(false);
                }}
                onConfirm={async () => regenerateSigningKey()}
            >
                <DynamicT forKey="resource_details.security.regenerate_key_reminder"/>
            </ConfirmModal>
        </FormField>
    );
}

export default SigningKeyField;
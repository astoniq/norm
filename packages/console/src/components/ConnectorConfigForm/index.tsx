import {ConnectorConfigFormItem} from "@astoniq/norm-schema";
import {Controller, useFormContext} from "react-hook-form";
import {ConnectorFormType} from "../../types";
import {jsonValidator} from "../../utils";
import {FormField} from "../FormField";
import {CodeEditor} from "../CodeEditor";
import {ConnectorConfigFormFields} from "../ConnectorConfigFormFields";


export type ConnectorConfigFormProps = {
    formItems?: ConnectorConfigFormItem[];
    className?: string;
}

export function ConnectorConfigForm(
    {
        formItems,
        className,
    }: ConnectorConfigFormProps
) {

    const {
        control,
        formState: { errors },
    } = useFormContext<ConnectorFormType>();

    return (
        <div className={className}>
            {formItems ? (
                <ConnectorConfigFormFields formItems={formItems} />
            ) : (
                <FormField title="connectors.guide.config">
                    <Controller
                        name="jsonConfig"
                        control={control}
                        rules={{
                            validate: (value) => jsonValidator(value) || t('errors.invalid_json_format'),
                        }}
                        render={({ field: { onChange, value } }) => (
                            <CodeEditor
                                error={errors.jsonConfig?.message ?? Boolean(errors.jsonConfig)}
                                language="json"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FormField>
            )}
        </div>
    )
}
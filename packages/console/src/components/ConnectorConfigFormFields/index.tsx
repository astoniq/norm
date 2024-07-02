import {ConnectorConfigFormItem, ConnectorConfigFormItemType} from "@astoniq/norm-schema";
import {ConnectorFormType} from "../../../types";
import {useFormContext, Controller} from "react-hook-form";
import React, {useCallback} from "react";
import TextInput from "../TextInput";
import {jsonValidator} from "../../utils";
import {Select} from "../Select";

import styles from './index.module.css';
import {FormField} from "../FormField";
import {CodeEditor} from "../CodeEditor";
import Textarea from "../Textarea";
import Switch from "../Switch";
import CheckboxGroup from "../CheckboxGroup";
import {useTranslation} from "react-i18next";

export type ConfigFormFieldsProps = {
    formItems: ConnectorConfigFormItem[]
}

export function ConnectorConfigFormFields(
    {
    formItems
    }: ConfigFormFieldsProps
) {

    const {t} = useTranslation()

    const {
        watch,
        register,
        control,
        formState: {
            errors: { formConfig: formConfigErrors },
        },
    } = useFormContext<ConnectorFormType>();

    const values = watch('formConfig')

    const showFormItems = useCallback(
        (formItem: ConnectorConfigFormItem) => {
            if (!formItem.showConditions) {
                return true;
            }

            return formItem.showConditions.every(({ expectValue, targetKey }) => {
                const targetValue = values[targetKey];

                return targetValue === expectValue;
            });
        },
        [values]
    );

    const renderFormItem = (item: ConnectorConfigFormItem) => {
        const errorMessage = formConfigErrors?.[item.key]?.message;
        const error =
            typeof errorMessage === 'string' && errorMessage.length > 0
                ? errorMessage
                : Boolean(formConfigErrors?.[item.key]);

        const buildCommonProperties = () => ({
            ...register(`formConfig.${item.key}`, {
                required: item.required,
                valueAsNumber: item.type === ConnectorConfigFormItemType.Number,
            }),
            placeholder: item.placeholder,
            error,
        });

        if (item.type === ConnectorConfigFormItemType.Text) {
            return (
                <TextInput
                    {...buildCommonProperties()}
                    isConfidential={item.isConfidential ?? /(Key|Secret)$/.test(item.key)}
                />
            );
        }

        if (item.type === ConnectorConfigFormItemType.MultilineText) {
            return <Textarea rows={5} {...buildCommonProperties()} />;
        }

        if (item.type === ConnectorConfigFormItemType.Number) {
            return <TextInput type="number" {...buildCommonProperties()} />;
        }

        return (
            <Controller
                name={`formConfig.${item.key}`}
                control={control}
                rules={{
                    required: item.type === ConnectorConfigFormItemType.Switch ? false : item.required,
                    validate:
                        item.type === ConnectorConfigFormItemType.Json
                            ? (value) =>
                                (typeof value === 'string' && jsonValidator(value)) ||
                                t('errors.invalid_json_format')
                            : undefined,
                }}
                render={({ field: { onChange, value } }) => {
                    if (item.type === ConnectorConfigFormItemType.Switch) {
                        return (
                            <Switch
                                label={item.label}
                                checked={typeof value === 'boolean' ? value : false}
                                onChange={({ currentTarget: { checked } }) => {
                                    onChange(checked);
                                }}
                            />
                        );
                    }

                    if (item.type === ConnectorConfigFormItemType.Select) {
                        return (
                            <Select
                                options={item.selectItems}
                                value={typeof value === 'string' ? value : undefined}
                                error={error}
                                onChange={onChange}
                            />
                        );
                    }

                    if (item.type === ConnectorConfigFormItemType.MultiSelect) {
                        return (
                            <CheckboxGroup
                                options={item.selectItems}
                                value={
                                    Array.isArray(value) &&
                                    value.every((item): item is string => typeof item === 'string')
                                        ? value
                                        : []
                                }
                                className={styles.multiSelect}
                                onChange={onChange}
                            />
                        );
                    }

                    if (item.type === ConnectorConfigFormItemType.Json) {
                        return (
                            <CodeEditor
                                language="json"
                                error={error}
                                value={typeof value === 'string' ? value : '{}'}
                                onChange={onChange}
                            />
                        );
                    }
                    return (
                        <TextInput
                            error={error}
                            value={typeof value === 'string' ? value : ''}
                            onChange={onChange}
                        />
                    );
                }}
            />
        );
    };

    return (
        <>
            {formItems.map((item) =>
                showFormItems(item) ? (
                    <FormField
                        key={item.key}
                        isRequired={item.required}
                        title={item.type !== ConnectorConfigFormItemType.Switch ?  item.label : null}
                    >
                        {renderFormItem(item)}
                        {Boolean(item.description) && (
                            <div className={styles.description}>{item.description}</div>
                        )}
                    </FormField>
                ) : null
            )}
        </>
    );
}
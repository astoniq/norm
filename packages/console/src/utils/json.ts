import { t } from 'i18next';
import {Json, JsonObject} from "@astoniq/norm-shared";
import {jsonGuard, jsonObjectGuard} from "@astoniq/norm-schema";

export const safeParseJson = (
    jsonString: string
): { success: true; data: Json } | { success: false; error: string } => {
    try {
        const data = jsonGuard.parse(JSON.parse(jsonString));

        return { success: true, data };
    } catch {
        return { success: false, error: t('errors.invalid_json_format') };
    }
};

export const safeParseJsonObject = (
    jsonString: string
): { success: true; data: JsonObject } | { success: false; error: string } => {
    try {
        const data = jsonObjectGuard.parse(JSON.parse(jsonString));

        return { success: true, data };
    } catch {
        return { success: false, error: t('admin_console.errors.invalid_json_format') };
    }
};
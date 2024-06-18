import { initReactI18next } from 'react-i18next';
import i18next from "i18next";
import {resources} from "@astoniq/norm-phrase";
import LanguageDetector from 'i18next-browser-languagedetector';

export const initI18n = async () => {
    await i18next
        .use(initReactI18next)
        .use(LanguageDetector)
        .init({
            resources: {},
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });

    // Load phrases
    for (const [language, values] of Object.entries(resources)) {
        i18next.addResourceBundle(language, 'translation', values.translation, true);
        i18next.addResourceBundle(language, 'errors', values.errors, true);
    }
};
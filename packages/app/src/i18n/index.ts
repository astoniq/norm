import i18next from "i18next";
import {resources} from "@astoniq/norm-phrase";

export default async function initI18n() {
    await i18next.init({
        fallbackLng: 'en',
        supportedLngs: Object.keys(resources),
        resources
    })
}
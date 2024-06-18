import {LocalePhrase} from "../../types/index.js";
import errors from "./errors/index.js";
import translation from "./translation/index.js";

const en: LocalePhrase = {
    translation,
    errors,
};

export default Object.freeze(en);
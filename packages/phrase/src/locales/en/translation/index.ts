import resources from "./resources.js";
import general from "./general.js";
import resource_details from "./resource-details.js";
import errors from "./errors.js";
import {Translation} from "../../../types/index.js";

const translation: Translation = {
    resources,
    errors,
    resource_details,
    general
};

export default Object.freeze(translation);
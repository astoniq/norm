import resources from "./resources.js";
import general from "./general.js";
import resource_details from "./resource-details.js";
import {Translation} from "../../../types/index.js";

const translation: Translation = {
    resources,
    resource_details,
    general
};

export default Object.freeze(translation);
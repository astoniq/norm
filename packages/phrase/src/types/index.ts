import {GeneralTranslation} from "./general.js";
import {ResourceTranslation} from "./resources.js";
import {DbErrors} from "./db.js";
import {ProjectErrors} from "./project.js";
import {AuthErrors} from "./auth.js";
import {GuardErrors} from "./guard.js";
import {ResourceDetailsTranslation} from "./resource-details.js";
import {ErrorsTranslation} from "./errors.js";


export type Translation = {
    general: GeneralTranslation,
    resources: ResourceTranslation,
    resource_details: ResourceDetailsTranslation,
    errors: ErrorsTranslation
}

export type Errors = {
    db: DbErrors,
    project: ProjectErrors,
    auth: AuthErrors,
    guard: GuardErrors
}

export type LocalePhrase = {
    translation: Translation
    errors: Errors
}
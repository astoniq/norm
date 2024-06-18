import {GeneralTranslation} from "./general.js";
import {ResourceTranslation} from "./resources.js";
import {DbErrors} from "./db.js";
import {TenantErrors} from "./tenant.js";
import {AuthErrors} from "./auth.js";
import {GuardErrors} from "./guard.js";


export type Translation = {
    general: GeneralTranslation,
    resources: ResourceTranslation
}

export type Errors = {
    db: DbErrors,
    tenant: TenantErrors,
    auth: AuthErrors,
    guard: GuardErrors
}

export type LocalePhrase = {
    translation: Translation
    errors: Errors
}
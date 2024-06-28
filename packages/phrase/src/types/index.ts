import {GeneralTranslation} from "./general.js";
import {ResourceTranslation} from "./resources.js";
import {DbErrors} from "./db.js";
import {ProjectErrors} from "./project.js";
import {AuthErrors} from "./auth.js";
import {GuardErrors} from "./guard.js";
import {ResourceDetailsTranslation} from "./resource-details.js";
import {ErrorsTranslation} from "./errors.js";
import {DashboardTranslation} from "./dashboard.js";
import {TopicTranslation} from "./topics.js";
import {TopicDetailsTranslation} from "./topic_details.js";


export type Translation = {
    general: GeneralTranslation,
    resources: ResourceTranslation,
    resource_details: ResourceDetailsTranslation,
    dashboard: DashboardTranslation,
    errors: ErrorsTranslation,
    topics: TopicTranslation,
    topic_details: TopicDetailsTranslation
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
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
import {ConnectorTranslation} from "./connectors.js";
import {ConnectorDetailsTranslation} from "./connector-details.js";
import {ConnectorErrors} from "./connector.js";
import {SubscriberTranslation} from "./subscribers.js";
import {ProjectTranslation} from "./projects.js";
import {NavigationTranslation} from "./navigation.js";


export type Translation = {
    general: GeneralTranslation,
    resources: ResourceTranslation,
    resource_details: ResourceDetailsTranslation,
    dashboard: DashboardTranslation,
    errors: ErrorsTranslation,
    topics: TopicTranslation,
    topic_details: TopicDetailsTranslation,
    connectors: ConnectorTranslation,
    subscribers: SubscriberTranslation,
    projects: ProjectTranslation,
    navigation: NavigationTranslation,
    connector_details: ConnectorDetailsTranslation
}

export type Errors = {
    db: DbErrors,
    project: ProjectErrors,
    auth: AuthErrors,
    guard: GuardErrors,
    connector: ConnectorErrors
}

export type LocalePhrase = {
    translation: Translation
    errors: Errors
}
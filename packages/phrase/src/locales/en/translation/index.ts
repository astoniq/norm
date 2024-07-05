import resources from "./resources.js";
import general from "./general.js";
import resource_details from "./resource-details.js";
import errors from "./errors.js";
import dashboard from "./dashboard.js";
import subscribers from "./subscribers.js";
import topic_details from './topic-details.js'
import connectors from './connectors.js'
import topics from "./topics.js";
import connector_details from "./connector-details.js";
import {Translation} from "../../../types/index.js";
import projects from "./projects.js";
import navigation from "./navigation.js";
import notifications from "./notifications.js";

const translation: Translation = {
    resources,
    errors,
    dashboard,
    topics,
    projects,
    navigation,
    notifications,
    subscribers,
    topic_details,
    connectors,
    resource_details,
    connector_details,
    general
};

export default Object.freeze(translation);
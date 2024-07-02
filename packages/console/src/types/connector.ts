import {ConnectorResponse} from "@astoniq/norm-schema";
import {ConnectorType, JsonObject} from "@astoniq/norm-shared";
import {SubmitTarget} from "react-router-dom/dist/dom";


export type ConnectorGroup<T = ConnectorResponse> = Pick<
    ConnectorResponse,
    'name' | 'description'
> & {
    id: string;
    connectors: T[];
};

export type ConnectorFormType = {
    name: string;
    type: ConnectorType;
    target: SubmitTarget;
    jsonConfig: string;
    /** The form config data. Used for form rendering. */
    formConfig: Record<string, unknown>;
    /** The raw config data. */
    rawConfig: JsonObject;
};
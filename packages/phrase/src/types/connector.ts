
export type ConnectorErrors = {
    general: string,
    not_found: string,
    not_enabled: string,
    invalid_metadata: string,
    invalid_config_guard:string,
    unexpected_type: string,
    invalid_request_parameters: string,
    insufficient_request_parameters: string,
    invalid_config: string,
    invalid_certificate:
        string,
    invalid_response: string,
    template_not_found: string,
    template_not_supported:string,
    not_implemented: string,
    db_connector_type_mismatch: string,
    not_found_with_connector_id: string,
}
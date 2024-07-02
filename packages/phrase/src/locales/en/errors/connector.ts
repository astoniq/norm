const connector = {
    general: 'Error occurred in connector: {{errorDescription}}',
    not_found: 'Cannot find any available connector for type: {{type}}.',
    not_enabled: 'The connector is not enabled.',
    invalid_metadata: "The connector's metadata is invalid.",
    invalid_config_guard: "The connector's config guard is invalid.",
    unexpected_type: "The connector's type is unexpected.",
    invalid_request_parameters: 'The request is with wrong input parameter(s).',
    insufficient_request_parameters: 'The request might miss some input parameters.',
    invalid_config: "The connector's config is invalid.",
    invalid_certificate:
        "The connector's certificate is invalid, please make sure the certificate is in PEM encoding.",
    invalid_response: "The connector's response is invalid.",
    template_not_found: 'Unable to find correct template in connector config.',
    template_not_supported: 'The connector does not support this template type.',
    not_implemented: '{{method}}: has not been implemented yet.',
    db_connector_type_mismatch: 'There is a connector in the DB that does not match the type.',
    not_found_with_connector_id: 'Can not find connector with given standard connector id.',

};

export default Object.freeze(connector);
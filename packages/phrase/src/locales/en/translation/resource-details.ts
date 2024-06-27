const resource_details = {
    page_title: 'Resource details',
    back_to_resources: 'Back to resources',
    not_in_use: 'Not in use',
    delete_resource: 'Delete resource',
    deletion_reminder:
        'You are removing this webhook. After deleting it will not send HTTP request to endpoint URL.',
    deleted: 'The resource has been successfully deleted.',
    settings_tab: 'Settings',
    workflows_tab: 'Workflows',
    security_tab: 'Security',
    security: {
        security: 'Security',
        security_description: 'Securely manage signing keys used by your applications',
        form_title: 'Signing keys',
        form_description: 'Add the secret key provided by norm to your endpoint as a request header to ensure the authenticity of the webhook’s payload.',
        signing_key: 'Signing key',
        signing_key_tip:
            'Add the secret key provided  your endpoint as a request header to ensure the authenticity of the webhook’s payload.',
        regenerate: 'Regenerate',
        regenerate_key_title: 'Regenerate signing key',
        regenerate_key_reminder:
            'Are you sure you want to modify the signing key? Regenerating it will take effect immediately. Please remember to modify the signing key synchronously in your endpoint.',
        regenerated: 'Signing key has been regenerated.',
    },
    settings: {
        settings: 'Settings',
        settings_description:
            'Webhooks allow you to receive real-time updates on specific events as they happen, by sending a POST request to your endpoint URL. This enables you to take immediate actions based on the new information received.',
        name: 'Name',
        form_title: 'Information',
        form_description: 'Edit your resource information',
        endpoint_url: 'Endpoint URL',
        custom_headers: 'Custom headers',
        custom_headers_tip:
            'Optionally, you can add custom headers to the webhook’s payload to provide additional context or metadata about the event.',
        key_duplicated_error: 'Key cannot be repeated.',
        key_missing_error: 'Key is required.',
        value_missing_error: 'Value is required.',
        invalid_key_error: 'Key is invalid',
        invalid_value_error: 'Value is invalid',
    }
};

export default Object.freeze(resource_details);
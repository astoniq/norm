const connector_details = {
    page_title: 'Connector details',
    back_to_connectors: 'Back to connectors',
    not_in_use: 'Not in use',
    delete_connector: 'Delete connector',
    deletion_reminder:
        'You are removing this webhook. After deleting it will not send HTTP request to endpoint URL.',
    deleted: 'The connector has been successfully deleted.',
    settings_tab: 'Settings',
    configuration_tab: 'Configuration',
    settings: {
        settings: 'Settings',
        settings_description:
            'General settings connector',
        name: 'Name',
        form_title: 'Information',
        form_description: 'Edit your connector information',
    },
    configuration: {
        configuration: 'Configuration',
        configuration_description: 'Configuration connector',
        name: 'Name',
        form_title: 'General',
        form_description: 'Configure the credentials and information',
    }
};

export default Object.freeze(connector_details);
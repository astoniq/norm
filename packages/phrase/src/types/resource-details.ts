export type ResourceDetailsTranslation = {
    page_title: string,
    back_to_resources: string,
    not_in_use: string,
    delete_resource: string,
    deletion_reminder:
        string,
    deleted: string,
    settings_tab: string,
    workflows_tab: string,
    security_tab: string,
    settings: {
        settings: string,
        settings_description:
            string,
        name: string,
        form_title: string,
        form_subtitle: string,
        endpoint_url: string,
        signing_key: string,
        signing_key_tip:
            string,
        regenerate: string,
        regenerate_key_title: string,
        regenerate_key_reminder:
            string,
        regenerated: string,
        custom_headers: string,
        custom_headers_tip:
            string,
        key_duplicated_error: string,
        key_missing_error: string,
        value_missing_error: string,
        invalid_key_error: string,
        invalid_value_error: string,
    }
}
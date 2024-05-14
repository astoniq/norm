export interface Errors {
    auth: {
        authorization_header_missing: string;
        authorization_token_type_not_supported: string;
        unauthorized: string;
        forbidden: string;
        expected_role_not_found: string;
        jwt_sub_missing: string;
        require_re_authentication: string;
    },
    application: {
        invalid_type: string;
        role_exists: string;
        invalid_role_type: string;
        invalid_third_party_application_type: string;
        third_party_application_only: string;
        user_consent_scopes_not_found: string;
        consent_management_api_scopes_not_allowed: string;
        protected_app_metadata_is_required: string;
        protected_app_not_configured: string;
        cloudflare_unknown_error: string;
        protected_application_only: string;
        protected_application_misconfigured: string;
        protected_application_subdomain_exists: string;
        invalid_subdomain: string;
        custom_domain_not_found: string;
        should_delete_custom_domains_first: string;
    }
    guard: {
        invalid_input: string;
    },
    entity: {
        invalid_input: string;
        create_failed: string;
        db_constraint_violated: string;
        not_exists: string;
        not_exists_with_id: string;
        not_found: string;
        relation_foreign_key_not_found: string;
        unique_integrity_violation: string;
    },
    verification_code: {
        phone_email_empty: string,
        not_found: string,
        phone_mismatch: string,
        email_mismatch: string,
        code_mismatch: string,
        expired: string,
        exceed_max_try: string,
    },
    session: {
        not_found: string,
        invalid_credentials: string,
        invalid_sign_in_method: string,
        invalid_connector_id: string,
        insufficient_info: string,
        connector_id_mismatch: string,
        connector_session_not_found: string,
        verification_session_not_found: string,
        verification_expired: string,
        verification_blocked_too_many_attempts: string,
        unauthorized: string,
        unsupported_prompt_name: string,
        forgot_password_not_enabled: string,
        verification_failed: string,
        connector_validation_session_not_found: string,
        identifier_not_found: string,
        interaction_not_found: string,
        not_supported_for_forgot_password: string,
        mfa: {
            require_mfa_verification: string,
            mfa_sign_in_only: string,
            pending_info_not_found: string,
            invalid_totp_code: string,
            bind_mfa_existed: string,
            backup_code_can_not_be_alone: string,
            backup_code_required: string,
            invalid_backup_code: string,
            mfa_policy_not_user_controlled: string,
        },
        sso_enabled: string,
    },
    user: {
        username_already_in_use: string,
        email_already_in_use: string,
        phone_already_in_use: string,
        invalid_email: string,
        invalid_phone: string,
        email_not_exist: string,
        phone_not_exist: string,
        identity_not_exist: string,
        identity_already_in_use: string,
        social_account_exists_in_profile: string,
        cannot_delete_self: string,
        sign_up_method_not_enabled: string,
        sign_in_method_not_enabled: string,
        same_password: string,
        password_required_in_profile: string,
        new_password_required_in_profile: string,
        password_exists_in_profile: string,
        username_required_in_profile: string,
        username_exists_in_profile: string,
        email_required_in_profile: string,
        email_exists_in_profile: string,
        phone_required_in_profile: string,
        phone_exists_in_profile: string,
        email_or_phone_required_in_profile: string,
        suspended: string,
        user_not_exist: string,
        missing_profile: string,
        role_exists: string,
        invalid_role_type: string,
        missing_mfa: string,
        totp_already_in_use: string,
        backup_code_already_in_use: string,
        password_algorithm_required: string,
        password_and_digest: string,
    }
}

export interface Translation {
    oidc: {
        logout_success: string;
    }
}

export type LocalePhrase = {
    translation: Translation
    errors: Errors
}
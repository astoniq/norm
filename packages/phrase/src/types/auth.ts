
export type AuthErrors = {
    authorization_header_missing: string,
    authorization_token_type_not_supported: string,
    unauthorized: string,
    forbidden: string,
    expected_role_not_found: string,
    jwt_sub_missing: string,
    require_re_authentication: string,
}
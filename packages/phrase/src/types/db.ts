
export type DbErrors = {
    invalid_input: string;
    create_failed: string;
    constraint_violated: string;
    not_exists: string;
    not_exists_with_id: string;
    not_found: string;
    relation_foreign_key_not_found: string;
    unique_integrity_violation: string;
}
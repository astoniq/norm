export enum ConnectorErrorCodes {
    General = 'general',
    InvalidMetadata = 'invalid_metadata',
    UnexpectedType = 'unexpected_type',
    InvalidConfigGuard = 'invalid_config_guard',
    InvalidRequestParameters = 'invalid_request_parameters',
    InsufficientRequestParameters = 'insufficient_request_parameters',
    InvalidConfig = 'invalid_config',
    InvalidCertificate = 'invalid_certificate',
    InvalidResponse = 'invalid_response'
}

export class ConnectorError extends Error {
    public code: ConnectorErrorCodes;
    public data: unknown;

    constructor(code: ConnectorErrorCodes, data?: unknown) {
        const message = `ConnectorError: ${data ? JSON.stringify(data) : code}`;
        super(message);
        this.code = code;
        this.data = typeof data === 'string' ? { message: data } : data;
    }
}
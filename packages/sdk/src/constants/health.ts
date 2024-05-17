export type HealthCheck = {
    status: 'ok' | 'error';
    discover: {
        workflows: number;
        steps: number;
    };
};
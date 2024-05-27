import {createHmac} from 'node:crypto';

export const sign = (signingKey: string, payload: any) => {
    const hmac = createHmac('sha256', signingKey);
    const payloadString = JSON.stringify(payload);
    hmac.update(payloadString);
    return hmac.digest('hex')
}
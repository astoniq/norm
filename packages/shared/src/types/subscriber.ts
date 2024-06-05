export enum SubscriberTarget {
    Email = 'email',
    Sms = 'sms',
    App = 'app'
}

export type SubscriberEmailCredentials = {
    email: string;
}

export type SubscriberReferenceEmailPayload = {
    target: SubscriberTarget.Email,
    credentials: SubscriberEmailCredentials
};

export type SubscriberAppCredentials = {
    token: string;
}

export type SubscriberReferenceAppPayload = {
    target: SubscriberTarget.App,
    credentials: SubscriberAppCredentials
};

export type SubscriberSmsCredentials = {
    phone: string;
}

export type SubscriberReferenceSmsPayload = {
    target: SubscriberTarget.Sms,
    credentials: SubscriberSmsCredentials
};

export type SubscriberReferencePayload =
    | SubscriberReferenceEmailPayload
    | SubscriberReferenceAppPayload
    | SubscriberReferenceSmsPayload

export type SubscriberPayload = {
    username?: string | null,
    email?: string | null,
    phone?: string | null,
    name?: string | null,
    locale?: string | null,
    avatar?: string | null
}

export type SubscriberDefine = SubscriberPayload & {
    subscriberId: string;
    references?: SubscriberReferencePayload[]
}
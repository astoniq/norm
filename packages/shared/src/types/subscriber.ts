export enum SubscriberTarget {
    Email = 'email',
    Sms = 'sms',
    Id = 'id'
}

export type SubscriberEmailCredentials = {
    email: string;
}

export type SubscriberReferenceEmailPayload = {
    target: SubscriberTarget.Email,
    credentials: SubscriberEmailCredentials
};

export type SubscriberIdCredentials = {
    id: string;
}

export type SubscriberReferenceIdPayload = {
    target: SubscriberTarget.Id,
    credentials: SubscriberIdCredentials
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
    | SubscriberReferenceIdPayload
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
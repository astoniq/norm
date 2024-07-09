export enum SubscriberTarget {
    Email = 'email',
    Phone = 'phone',
    Id = 'id'
}

export type SubscriberEmailCredentials = {
    email: string;
}

export type SubscriberReferenceEmailPayload = {
    referenceId: string;
    target: SubscriberTarget.Email,
    credentials: SubscriberEmailCredentials
};

export type SubscriberIdCredentials = {
    id: string;
}

export type SubscriberReferenceIdPayload = {
    referenceId: string;
    target: SubscriberTarget.Id,
    credentials: SubscriberIdCredentials
};

export type SubscriberSmsCredentials = {
    phone: string;
}

export type SubscriberReferencePhonePayload = {
    referenceId: string;
    target: SubscriberTarget.Phone,
    credentials: SubscriberSmsCredentials
};

export type SubscriberReferencePayload =
    | SubscriberReferenceEmailPayload
    | SubscriberReferenceIdPayload
    | SubscriberReferencePhonePayload

export type SubscriberPayload = {
    username?: string | null,
    name?: string | null,
    locale?: string | null,
    avatar?: string | null
}

export type SubscriberDefine = SubscriberPayload & {
    subscriberId: string;
    references?: SubscriberReferencePayload[]
}
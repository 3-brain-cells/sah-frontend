export type ProfileGroup = {
    id: string;
    name: string;
    profiles: Record<string, Profile>;
};

export type Profile = {
    id: string;
    name: string;
    shipping: Shipping;
    billing: Billing;
    card: Card;
};

export type Shipping = {
    name: string;
    one: string;
    two: string;
    zip: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    sameAsBilling: boolean;
};

export type Card = {
    cardName: string;
    number: string;
    month: string;
    year: string;
    cvv: string;
};

export type Billing = {
    name: string;
    one: string;
    two: string | null;
    zip: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
};

export type StreetAddress = {
    one: string;
    two: string | null;
    zip: string;
    city: string;
    state: string;
    country: string;
};

export function getEffectiveShippingAddress(profile: Profile): StreetAddress {
    if (profile.shipping.sameAsBilling) {
        return profile.billing;
    }

    return profile.shipping;
}

export function streetAddressToString(address: StreetAddress): string {
    return [address.one, address.two ?? '', `${address.city}, ${address.state} ${address.zip}`]
        .filter((line) => line.length > 0)
        .join(' \\ ');
}

import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScoreFactors {
    cost: bigint;
    crowd: bigint;
    activities: bigint;
    traffic: bigint;
    weather: bigint;
}
export interface BestTimeToVisit {
    bestDays: Array<string>;
    bestMonths: Array<bigint>;
    reason: string;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Destination {
    id: bigint;
    country: string;
    name: string;
    bestTimeToVisit: BestTimeToVisit;
    description: string;
    crowdLevel: CrowdLevel;
    score: bigint;
    imageUrl: string;
    category: Category;
    scoreFactors: ScoreFactors;
    budget: BudgetEstimate;
    alternatives: Array<bigint>;
    coordinates: Coordinates;
}
export interface Coordinates {
    lat: number;
    lng: number;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface BudgetEstimate {
    total: bigint;
    hotel: bigint;
    food: bigint;
    transport: bigint;
    activities: bigint;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum Category {
    country = "country",
    city = "city",
    beach = "beach",
    mountain = "mountain",
    attraction = "attraction"
}
export enum CrowdLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getDestination(id: bigint): Promise<Destination | null>;
    isCallerAdmin(): Promise<boolean>;
    listDestinations(): Promise<Array<Destination>>;
    schema(): Promise<string>;
    searchDestinations(searchTerm: string, category: Category | null): Promise<Array<Destination>>;
}

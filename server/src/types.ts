export interface Activity {
    id: string;
    description: string;
    organisation: Organization;
    distanceFromSearchLocation: DistanceFromSearchLocation;
    role: Role;
    session: Session;
    title: string;
}

export interface DistanceFromSearchLocation {
    value: number;
    type: string;
}

export interface Session {
    id: string;
    location: LinkedGeolocation[];
}

export interface LinkedGeolocation {
    id: string;
    latitude: string;
    longitude: string;
}

export interface Organization {
    id: string;
    cause: Cause[];
    description: string;
    name: string;
}

export interface Cause {
    id: string;
    label: string;
}

export interface Role {
    id: string;
    requirement: Requirement[];
}

export interface Requirement {
    id: string;
    label: string;
}

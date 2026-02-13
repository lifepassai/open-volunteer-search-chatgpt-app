const API_URL = 'https://api.volunteeringdata.io/activity_by_location'; //?lat=51.509&lon=-0.118&within=1000';

export interface Geolocation {
    latitude: number;
    longitude: number;
}

export interface VolunteerOpportunitiesQuery {
    geolocation?: Geolocation,
    keywords?: string[],
    flexibleHours?: boolean,
    age?: number,
    distance?: number,
    timeCommitment?: 'on-going' | 'one-time';
    workLocation?: 'remote' | 'in-person';
}

export interface Binding {
    activity_id: { value: string };
    activity_name: { value: string };
    activity_latitude: { value: string };
    activity_longitude: { value: string };
    activity_distance_from_search_location_in_metres: { value: string };
    activity_description: { value: string };
    organisation_name: { value: string };
    organisation_description: { value: string };
}

export interface VolunteerOpportunitQueryResult {
    results: {
        bindings: Binding[]
    }
} 

export async function queryVolunteerOpportunities(query: VolunteerOpportunitiesQuery) {
    const { geolocation, distance = 25 } = query; // default to within 25km

    const url = new URL(API_URL);
    if (geolocation) {
        url.searchParams.append('lat', geolocation.latitude.toString());
        url.searchParams.append('lon', geolocation.longitude.toString());
    }
    if (distance)
        url.searchParams.append('within', (distance * 1000).toString());

    // TODO add more filters

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            //'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    if (!response.ok)
        throw new Error(`Failed to query volunteer opportunities: ${url.toString()} ${response.status} ${response.statusText}`);

    const data = await response.json() as VolunteerOpportunitQueryResult;
    return data.results.bindings.map(e=>({
        id: e.activity_id.value,
        name: e.activity_name.value,
        description: e.activity_description.value,
        organisation: {
            name: e.organisation_name.value,
            description: e.organisation_description.value,
        },
        coords: [
            parseFloat(e.activity_longitude.value),
            parseFloat(e.activity_latitude.value),
        ],
        distance: parseFloat(e.activity_distance_from_search_location_in_metres.value),
        thumbnail: randomItem(THUMBNAILS),
        city: randomItem(CITIES),
        timeType: randomItem(["Fixed", "Flexible"])
    }));
}

const THUMBNAILS = [
    "/thumbnails/food-bank.png",
    "/thumbnails/beach-cleanup.png",
    "/thumbnails/senior-tech-aid.png",
    "/thumbnails/community-garden.png",
    "/thumbnails/animal-rescue.png",
    "/thumbnails/youth-mentorship.png",
    "/thumbnails/food-bank.png",
    "/thumbnails/youth-mentorship.png",
    "/thumbnails/senior-tech-aid.png",
    "/thumbnails/community-garden.png",
];

const CITIES = [
    "North Beach",
    "Mission",
    "Alamo Square",
    "SoMa",
    "Yerba Buena",
];

function randomItem(items: string[]) {
    return items[Math.floor(Math.random() * items.length)];
}

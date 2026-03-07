import { type Activity } from "./types.js";
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


export interface VolunteerOpportunitQueryResult {
    id: string;
    activities: Activity[];
} 

export async function queryVolunteerOpportunities(query: VolunteerOpportunitiesQuery, limit: number = 20) {
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
    if( !data.activities )
        throw new Error(`No results found for query ${url}: ${JSON.stringify(data, null, 4)}`);

    if( data.activities.length > limit ) {
        console.warn(`Limiting results to ${limit} from ${data.activities.length}`);
        data.activities = data.activities.slice(0, limit);
    }
    return data.activities.map((e) => {
        const loc = e.session?.location?.[0];
        const lng = loc ? parseFloat(loc.longitude) : 0;
        const lat = loc ? parseFloat(loc.latitude) : 0;
        return {
            id: e.id,
            name: e.title,
            description: e.description,
            organisation: {
                name: e.organisation.name,
                description: e.organisation.description,
            },
            coords: [lng, lat],
            distance: parseFloat(String(e.distanceFromSearchLocation?.value ?? "0")),
            thumbnail: randomItem(THUMBNAILS),
            city: randomItem(CITIES),
            timeType: randomItem(["Fixed", "Flexible"]),
        };
    });
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

import {Location} from "../schema/location.ts";

export async function loadLocations(): Promise<Location[]> {
    const locations = localStorage.getItem('savedLocations');
    if (locations === null) {
        return [];
    }
    return JSON.parse(locations);
}

export async function saveLocation(location: Location) {
    console.log("Saving destination:", location.displayName);
    const locations = await loadLocations();
    if (locations.findIndex(l => l.placeId === location.placeId) === -1 || locations.length === 0) {
        locations.push(location);
        localStorage.setItem('savedLocations', JSON.stringify(locations));
    }
}

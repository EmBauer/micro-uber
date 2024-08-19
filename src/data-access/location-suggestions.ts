import {Locations} from "../schema/location.ts";

export async function getLocationSuggestions(input: string) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1`
    );
    if(!response.ok) {
        throw new Error("network response was not ok.");
    }
    const json = await response.json();
    const {error, data} = Locations.safeParse(json);
    if(error) {
        console.error(error.flatten());
        throw new Error("Validation error");
    }
    return data;
}

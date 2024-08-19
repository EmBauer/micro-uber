import {useSavedLocations} from "../hooks/use-saved-locations.ts";

function SavedDestinations() {
    const {locations} = useSavedLocations();

    return (
        <>
            <h2 className="text-xl font-thin">Saved destinations</h2>
            <div>
                <ul className="list-disc list-inside">
                    {locations.map((location) => (
                        <li key={location.placeId}>{location.displayName}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default SavedDestinations;

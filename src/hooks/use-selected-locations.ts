import {useContext} from "react";
import {SelectedLocationsContext} from "../context/selected-locations-provider.tsx";

export function useSelectedLocations() {
    const context = useContext(SelectedLocationsContext);
    if(context === null) {
        throw new Error("useSelectedLocations must be used within an SelectedLocationsContext provider")
    }
    return context;
}

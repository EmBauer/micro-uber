import {useContext} from "react";
import {LocationContext} from "../context/geolocation-provider.tsx";

export function useGeolocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a GeolocationProvider');
    }
    return context;
}

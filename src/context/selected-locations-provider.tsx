import {createContext, ReactNode, useState} from "react";
import {Location} from "../schema/location.ts";

type SelectedLocationsContextType = {
    selectedStart: Location | null;
    setSelectedStart: (location: Location | null) => void;
    selectedDestination: Location | null;
    setSelectedDestination: (location: Location | null) => void;
}

export const SelectedLocationsContext = createContext<SelectedLocationsContextType | null>(null);

function SelectedLocationsProvider({children}: {children: ReactNode}) {
    const [selectedStart, setSelectedStart] = useState<Location | null>(null);
    const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

    return (
        <SelectedLocationsContext.Provider value={{selectedStart, setSelectedStart, selectedDestination, setSelectedDestination}}>
            {children}
        </SelectedLocationsContext.Provider>
    );
}

export default SelectedLocationsProvider;

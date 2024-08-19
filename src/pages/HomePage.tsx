import Map from "../components/map.tsx";
import {useSelectedLocations} from "../hooks/use-selected-locations.ts";
import TopBar from "../components/top-bar.tsx";
import {useState} from "react";

function HomePage() {
    const {
        selectedDestination,
        selectedStart
    } = useSelectedLocations();

    const [response, setResponse] = useState();

    return (
        <>
            <TopBar setResponse={setResponse}/>
            <div className="p-5 h-[89vh]">
                <div className={"h-full w-full"}>
                    <Map selectedDestination={selectedDestination && [selectedDestination.lat, selectedDestination.lon]}
                         selectedStart={selectedStart && [selectedStart.lat, selectedStart.lon]} response={response}
                    />
                </div>
            </div>
        </>
    );
}

export default HomePage;

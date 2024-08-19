import {FaSearch} from "@react-icons/all-files/fa/FaSearch"
import {IoMdClose} from "@react-icons/all-files/io/IoMdClose"
import {FaRoute} from "@react-icons/all-files/fa/FaRoute"
import {useState} from "react";
import SearchBar from "./search-bar.tsx";
import {Location} from "../schema/location.ts";
import {useAuth} from "../hooks/use-auth.ts";
import {Link} from "react-router-dom";
import {useSelectedLocations} from "../hooks/use-selected-locations.ts";
import useModal from "../hooks/use-modal.tsx";

type TopBarProps = {
    setResponse: React.Dispatch<React.SetStateAction<any>>;
};

function TopBar({setResponse} : TopBarProps) {
    const {isAuthenticated, isDriver} = useAuth();
    const {openModal, ModalComponent, setContent, setTitle} = useModal()

    const [searchWindowOpen, setSearchWindowOpen] = useState(false)
    const {selectedStart, setSelectedStart, selectedDestination, setSelectedDestination} = useSelectedLocations();

    const handleStartSelected = (place: Location) => {
        setSelectedStart(place);
    };

    const handleDestinationSelected = (place: Location) => {
        setSelectedDestination(place);
    };

    const handleTripRequest = async () => {
        try {
            console.log('Request trip');
            if (selectedStart == null || selectedDestination == null) {

                throw new Error('Start and destination must be selected');

            }

            const coordinates = {
                lat: selectedStart.lat,
                lon: selectedStart.lon,
                destLat: selectedDestination.lat,
                destLon: selectedDestination.lon
            }

            console.log("Coordinates: " + coordinates)
            const res = await fetch('https://voidvls1d5.execute-api.eu-central-1.amazonaws.com/dev/request-trip', {
                method: 'POST', // or 'POST', 'PUT', etc.
                headers: {
                    'Content-Type': 'application/json',
                    // Include any other headers you need, like Authorization tokens
                },
                // If you have a POST/PUT request, you can include a body like so:
                body: JSON.stringify(coordinates),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Data: ", data)
            if(data.body){
                console.log("Data.body: ", data.body)
                const jsonData = JSON.parse(data.body)
                jsonData.statusCode = data.statusCode;
                console.log("Data")
                setResponse(jsonData);
            }
            console.log('Success:', JSON.parse(data.body));
        } catch (error) {
            console.error('Error:', error);
            setTitle("An error occurred during trip request")
            setContent(error.message)
            openModal()
        }
    };

    return (
        <>
            <div className={"bg-primary flex justify-between items-center relative flex-col sm:flex-row"}>
                <h1 className={"p-6 font-extrabold text-2xl"}>UBERT</h1>
                <div className={"p-6 text-xl flex gap-24 items-center"}>
                    {isAuthenticated && isDriver &&
                        <div><Link to="/driver" className="hover:underline font-extrabold">Driver Panel</Link></div>}
                    {/*{isAuthenticated && isAdmin &&*/}
                    {/*    <div><Link to="/admin" className="hover:underline font-extrabold">Admin Panel</Link></div>}*/}
                    {isAuthenticated && <div><Link className="hover:underline font-extrabold"
                                                   to="https://ubert.auth.eu-central-1.amazoncognito.com/logout?client_id=62skmsghj5jl9ofig9i6jjamnr&logout_uri=https%3A%2F%2Fmain.d1yjl7rf5twhel.amplifyapp.com%2Flogout">Logout</Link>
                    </div>}
                    <div>
                        {isAuthenticated ? <button onClick={() => setSearchWindowOpen(prev => !prev)}
                                                   title={searchWindowOpen ? "Close" : "Open route planner"}>
                                {searchWindowOpen ? <IoMdClose/> : <FaRoute/>}
                            </button>
                            : <Link
                                to="https://ubert.auth.eu-central-1.amazoncognito.com/oauth2/authorize?client_id=62skmsghj5jl9ofig9i6jjamnr&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmain.d1yjl7rf5twhel.amplifyapp.com%2Fcallback"
                                className="font-extrabold hover:underline">Login</Link>
                        }
                    </div>
                </div>
            </div>
            <div className={`absolute bg-primary px-6 pb-8 z-10 w-full ${searchWindowOpen ? "block" : "hidden"}`}>
                <div className={"flex flex-col gap-3"}>
                    <h1 className="text-2xl font-bold mb-3">Search for your final destination</h1>
                    <div className={"w-3/5"}>
                        <SearchBar onPlaceSelected={handleStartSelected}
                                   description={"Start?"}
                                   onClearInput={() => setSelectedStart(null)}
                        />
                    </div>
                    <div className={"flex gap-5"}>
                        <div className={"w-3/5"}>
                            <SearchBar onPlaceSelected={handleDestinationSelected}
                                       description={"Where to?"}
                                       onClearInput={() => setSelectedDestination(null)}
                            />
                        </div>
                        <button className="rounded-2xl" onClick={handleTripRequest}>
                            <FaSearch/>
                        </button>
                    </div>
                </div>
            </div>
            <ModalComponent />
        </>
    )
}

export default TopBar;

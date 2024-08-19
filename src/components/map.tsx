import {MapContainer, Marker, Polyline, Popup, TileLayer, useMap} from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import {useGeolocation} from "../hooks/use-geolocation.ts";
import marker from "../assets/user-location.svg";
import iconMarker from "../assets/destination-icon.svg"
import {useEffect, useState} from "react";
import {useWebsocket} from "../hooks/use-websocket.ts";
import useModal from "../hooks/use-modal.tsx";
import {useSelectedLocations} from "../hooks/use-selected-locations.ts";

const markerIcon = new L.Icon({
    iconUrl: iconMarker,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // must be half of icon size
    popupAnchor: [0, -32],
});

const ownLocationIcon = new L.Icon({
    iconUrl: marker,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
})

const carIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="black">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const myDriverIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="blue">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const occupiedDriverIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="red">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

type MapProps = {
    selectedDestination?: [number, number] | null,
    selectedStart?: [number, number] | null,
    response?: any
}

function Map({selectedDestination, selectedStart, response}: MapProps) {
    const location = useGeolocation();
    const {message} = useWebsocket("user")
    const [center, setCenter] = useState<[number, number]>([48.78232, 9.17702]);
    const [isInitialCenter, setIsInitialCenter] = useState<boolean>(true);
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const [route, setRoute] = useState([]);
    const [destinationRoute, setDestinationRoute] = useState(null);
    const {openModal, setContent, setTitle, ModalComponent} = useModal();
    const {setSelectedStart, setSelectedDestination} = useSelectedLocations()

    useEffect(() => {
        try {
            if (response === undefined) {
                return;
            }
            if (response.statusCode === 204) {
                setTitle("No drivers available")
                setContent("Unfortunately, there are no drivers available at the moment.")
                openModal()
                return
            }
            console.log("Response: ", response)
            const connectionId = response?.selectedDriver?.connectionId
            setConnectionId(connectionId);
            console.log(connectionId)
            console.log("Message: ", message)

            if (message?.action !== "broadcastLocation")
                return;

            const driver = message.message.filter(driver => driver.connectionId.S === connectionId)[0]
            console.log("Driver: ", driver)
            if (driver.isOccupied.BOOL && destinationRoute == null) {
                setRoute(response.driverRoute.route.coordinates.map(coord => [coord[1], coord[0]]));
                setDestinationRoute(response.destinationRoute.route.coordinates.map(coord => [coord[1], coord[0]]))
            } else if (!driver.isOccupied.BOOL && destinationRoute != null) {
                console.log("Wrong ")
                handleUserArrive()
            }
        } catch (error) {
            setTitle("An error occurred while trying to find the closest driver")
            setContent(error.message)
            openModal()
        }
    }, [response, message]);

    useEffect(() => {
        if (location && isInitialCenter) {
            setCenter([location.lat, location.lng]);
            setIsInitialCenter(false);
        }
        if (selectedDestination) {
            setCenter(selectedDestination);
        } else if (selectedStart) {
            setCenter(selectedStart);
        }
    }, [location, selectedDestination, selectedStart, isInitialCenter]);

    const handleUserArrive = () => {
        setTitle("Your trip has ended!")
        setContent("You arrived at your destination. We hope you had a pleasant journey.")
        openModal()
        setSelectedStart(null)
        setSelectedDestination(null)
        setDestinationRoute(null)
        setRoute(null)
    }

    return (
        <>
            <MapContainer center={center} zoom={13} className="h-full w-full z-0">
                <ChangeCenter zoom={13} center={center}/>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {selectedDestination &&
                    <Marker position={selectedDestination} icon={markerIcon}>
                        <Popup>
                            Destination
                        </Popup>
                    </Marker>
                }
                {selectedStart &&
                    <Marker position={selectedStart} icon={markerIcon}>
                        <Popup>
                            Start
                        </Popup>
                    </Marker>
                }
                {location !== null &&
                    <Marker position={location} icon={ownLocationIcon}/>
                }
                {message?.message.map((driver) =>
                    <Marker
                        key={driver.connectionId.S}
                        position={[parseFloat(driver.lat.N), parseFloat(driver.lon.N)]}
                        icon={connectionId === driver.connectionId.S && destinationRoute ? myDriverIcon : driver.isOccupied.BOOL ? occupiedDriverIcon : carIcon}
                    />
                )};
                {route && route.length > 0 && <Polyline positions={route} color="black"/>}
                {destinationRoute && destinationRoute.length > 0 &&
                    <Polyline positions={destinationRoute} color="green"/>}
            </MapContainer>
            <ModalComponent/>
        </>
    );
}

type CenterProps = {
    center?: [number, number] | null,
    zoom: number,
}

function ChangeCenter({center, zoom}: CenterProps) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

export default Map;

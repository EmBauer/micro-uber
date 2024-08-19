import {useEffect, useRef, useState} from 'react';
import {MapContainer, Marker, Polyline, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import {useWebsocket} from "../hooks/use-websocket.ts";

// Define the bounding box for Stuttgart
const stuttgartBounds = {
    northEast: [48.8513, 9.2477],
    southWest: [48.7325, 9.0835]
};

// Create a simple circle SVG as the car icon
const carIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="black">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Generate random coordinates within the bounding box of Stuttgart
const getRandomCoordinate = () => {
    const lat = Math.random() * (stuttgartBounds.northEast[0] - stuttgartBounds.southWest[0]) + stuttgartBounds.southWest[0];
    const lng = Math.random() * (stuttgartBounds.northEast[1] - stuttgartBounds.southWest[1]) + stuttgartBounds.southWest[1];
    return [lat, lng];
};

// Fetch a route using the OSRM API between a start and end coordinate
const getRoute = async (start, end) => {
    try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        const response = await fetch(osrmUrl, {
            method: 'GET', // or POST, PUT, DELETE, etc.
                headers: {
                'Content-Type': 'application/json',
                // Add other headers as required by the API
            },
            mode: 'cors', // Ensure CORS is enabled
                credentials: 'include' // Use 'include' if the API requires cookies or other credentials
        })
        const data = await response.json();
        // console.log("Route data:", data);
        // Convert the route coordinates from [lng, lat] to [lat, lng]
        return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    } catch (error) {
        console.error("Error fetching route:", error);
        return [];
    }
};

function DriverMap({shouldMove}) {
    const [carPosition, setCarPosition] = useState(getRandomCoordinate()); // Initialize the car's position with a random coordinate
    const [route, setRoute] = useState([]); // State to hold the current route
    const [routeToUserDest, setRouteToUserDest] = useState()
    const [routeIndex, setRouteIndex] = useState(0); // Index to track the car's position along the route
    const [occupied, setOccupied] = useState(false)
    const {message, sendMessage} = useWebsocket("driver", carPosition[0], carPosition[1])
    const carPositionRef = useRef(carPosition);
    const [speed, setSpeed] = useState(500)


    useEffect(() => {
        carPositionRef.current = carPosition;
    }, [carPosition]);

    // Function to start the car's movement along a new route
    const startNewRoute = async (route?) => {
        const start = carPosition;
        const end = getRandomCoordinate();
        const newRoute = route || await getRoute(start, end);

        if (newRoute.length > 0) {
            setRoute(newRoute);
            setRouteIndex(0);
        }
    };

    // Update lambda function with actual position
    useEffect(() => {
        if (!shouldMove) {
            return
        }
        const interval = setInterval(() => {
            // console.log("Car position interval: ", carPositionRef.current[0], carPositionRef.current[1]);
            sendMessage({
                action: "updateLocation",
                lat: carPositionRef.current[0],
                lon: carPositionRef.current[1]
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [shouldMove]);

    useEffect(() => {

        console.log("Message", message)
        const routeToUser = message?.driverRoute?.coordinates.map(coord => [coord[1], coord[0]]);
        // console.log("Message: ", message)
        if (routeToUser) {
            setSpeed(100)
            startNewRoute(routeToUser)
            setRouteToUserDest(message?.destinationRoute)
            sendMessage({
                action: "updateOccupancy",
                isOccupied: true
            })
            setOccupied(true)
        }
    }, [message]);

    // Start a new route when the component is first mounted
    useEffect(() => {
        if (shouldMove && route.length === 0) {
            startNewRoute();
        }
    }, [shouldMove, route]);

    // Handle movement along the route if shouldMove is true
    useEffect(() => {
        if (shouldMove && route.length > 0 && routeIndex < route.length - 1) {
            // Move to the next position on the route at regular intervals
            const interval = setInterval(() => {
                const nextPosition = route[routeIndex + 1];
                setRouteIndex(prevIndex => prevIndex + 1);

                // Set the new position if it's valid
                if (nextPosition && nextPosition[0] && nextPosition[1]) {
                    setCarPosition(nextPosition);
                }
            }, speed); // Update every 500ms (can be adjusted)

            return () => clearInterval(interval);
        } else if (shouldMove && routeIndex >= route.length - 1 && route.length > 0) {
            // When the end of the route is reached, start a new route
            // console.log("Dest route: ", routeToUserDest)

            // @ts-ignore
            if (routeToUserDest != null) {

                // @ts-ignore
                const coordinatesToUserDestination = routeToUserDest.coordinates.map(coord => [coord[1], coord[0]]);
                // setRoute(coordinatesToUserDestination)
                startNewRoute(coordinatesToUserDestination);
                setRouteToUserDest(null)
            } else {
                // console.log("Falsche ROute")
                startNewRoute();
                if (occupied)
                    sendMessage({
                        action: "updateOccupancy",
                        isOccupied: false
                    })
                setOccupied(false);
            }
        }
    }, [shouldMove, route, routeIndex, speed]);

    return (

        // @ts-ignore
        <MapContainer center={carPosition} zoom={13} className={"w-full h-full"}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            // @ts-ignore
            {route.length > 0 && <Polyline positions={route} color="black"/>} {/* Draw the route on the map */}
            {carPosition && carPosition[0] && carPosition[1] && (

                // @ts-ignore
                <Marker position={carPosition} icon={carIcon}/>
            )}
        </MapContainer>
    );
}

export default DriverMap;

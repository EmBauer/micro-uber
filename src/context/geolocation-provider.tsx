import React, { createContext, useState, useEffect } from 'react';

export interface UserLocation {
    lat: number;
    lng: number;
}

export const LocationContext = createContext<UserLocation | null>(null);

export function GeolocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocation] = useState<UserLocation | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error('Error getting location:', error)
            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [setLocation]);

    return (
        <LocationContext.Provider value={location}>
            {children}
        </LocationContext.Provider>
    );
}

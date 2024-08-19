import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import HomePage from "./pages/HomePage.tsx";
import {GeolocationProvider} from "./context/geolocation-provider.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Callback from "./pages/callback.tsx";
import AdminDashboard from "./pages/admin-dashboard.tsx";
import DriversInfo from "./pages/drivers-info.tsx";
import AdminRoute from "./routes/admin-route.tsx";
import Logout from "./pages/logout.tsx";
import SelectedLocationsProvider from "./context/selected-locations-provider.tsx";
import DriverDashboard from "./pages/driver-dashboard.tsx";
import DriverRoute from "./routes/driver-route.tsx";

function App() {
    const queryClient = new QueryClient();

    const router = createBrowserRouter([
        {
            path: "/",
            element: <>
                <SelectedLocationsProvider>
                    <HomePage/>
                </SelectedLocationsProvider>
            </>,
        },
        {
            path: "/callback",
            element: <Callback/>
        },
        {
            path: "/logout",
            element: <Logout/>
        },
        {
            path: "/driver",
            element: <DriverRoute/>,
            children: [
                {
                    path: "",
                    element: <DriverDashboard/>,
                }]
        },
        {
            path: "/admin",
            element: <AdminRoute/>,
            children: [
                {
                    path: "",
                    element: <AdminDashboard/>,
                },
                {
                    path: "drivers",
                    element: <DriversInfo/>,
                },
                {
                    path: "users",
                    element: <div className="p-8">TODO</div>,
                }
            ]
        }
    ]);

    return (
        <QueryClientProvider client={queryClient}>
            <GeolocationProvider>
                <RouterProvider router={router}/>
            </GeolocationProvider>
        </QueryClientProvider>
    )
}

export default App;

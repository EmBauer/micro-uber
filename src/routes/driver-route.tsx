import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../hooks/use-auth.ts";
import NavigateIn from "../components/navigate-in.tsx";

function DriverRoute() {
    const {isDriver, isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        console.error("user not authenticated");
        return <NavigateIn millis={500} externalTarget="https://ubert.auth.eu-central-1.amazoncognito.com/oauth2/authorize?client_id=62skmsghj5jl9ofig9i6jjamnr&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcallback"/>
    }

    if (!isDriver) {
        console.error("user is not driver, navigating to home")
        return <Navigate to="/"/>;
    }

    return <Outlet/>;
}

export default DriverRoute;

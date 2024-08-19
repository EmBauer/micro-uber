import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../hooks/use-auth.ts";
import NavigateIn from "../components/navigate-in.tsx";
import AdminTopBar from "../components/admin-top-bar.tsx";

function AdminRoute() {
    const {isAdmin, isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        console.error("user not authenticated");
        return <NavigateIn millis={500}
                           externalTarget="https://ubert.auth.eu-central-1.amazoncognito.com/oauth2/authorize?client_id=62skmsghj5jl9ofig9i6jjamnr&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmain.d1yjl7rf5twhel.amplifyapp.com%2Fcallback"/>
    }

    if (!isAdmin) {
        console.error("user is not admin, navigating to home")
        return <Navigate to="/"/>;
    }

    return (
        <>
            <AdminTopBar/>
            <Outlet/>
        </>
    );
}

export default AdminRoute;

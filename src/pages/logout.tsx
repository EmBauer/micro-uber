import {Link} from "react-router-dom";
import {useAuth} from "../hooks/use-auth.ts";
import {useEffect} from "react";

function Logout() {
    const {removeToken} = useAuth();

    useEffect(() => {
        removeToken();
    }, [removeToken]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">You're being logged out...</h1>
            <div>
                <Link to="/">Back to start</Link>
            </div>
        </div>
    );
}

export default Logout;

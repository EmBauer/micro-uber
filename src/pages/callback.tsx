import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/use-auth.ts";

function Callback() {
    const {saveToken} = useAuth();

    const {hash} = useLocation();
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (hash) {
            const params = new URLSearchParams(hash.slice(1));
            const accessToken = params.get('access_token');
            if (accessToken === null) {
                setError("Access token was null");
                return;
            }
            const expiresIn = parseInt(params.get('expires_in') || '0', 10);
            if (expiresIn === 0) {
                setError("expiresIn was null");
            }
            saveToken(accessToken, expiresIn);
            navigate("/");
        } else {
            setError("You could not be authenticated.");
        }
    }, [saveToken, hash, navigate]);

    return (
        <div className="container">
            {error ?
                <>
                    <h1 className="text-2xl font-bold">An error occured...</h1>
                    <div className="text-lg">{error}</div>
                    <div>
                        <Link to="/" className="bg-primary px-4 py-2 rounded">Back to home</Link>
                    </div>
                </>
                : <h1 className="text-2xl font-bold text-center">Hold on, we're authenticating you...</h1>
            }
        </div>
    );
}

export default Callback;

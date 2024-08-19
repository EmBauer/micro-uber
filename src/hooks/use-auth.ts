import Cookies from "js-cookie";
import {useCallback, useEffect, useState} from "react";

interface AuthToken {
    token: string;
    expiresAt: number;
}

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isDriver, setIsDriver] = useState<boolean>(false)

    const saveToken = useCallback((token: string, expiresIn: number) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        const authToken: AuthToken = { token, expiresAt };
        Cookies.set('authToken', JSON.stringify(authToken), {
            expires: new Date(expiresAt),
            secure: true,
            sameSite: 'strict'
        });
        setIsAuthenticated(true);
    }, []);

    const getToken = useCallback((): string | null => {
        const authTokenStr = Cookies.get('authToken');
        if (!authTokenStr) return null;

        const authToken: AuthToken = JSON.parse(authTokenStr);
        if (Date.now() > authToken.expiresAt) {
            Cookies.remove('authToken');
            setIsAuthenticated(false);
            return null;
        }

        return authToken.token;
    }, []);

    const removeToken = useCallback(() => {
        Cookies.remove('authToken');
        setIsAuthenticated(false);
    }, []);

    const apiRequest = useCallback(async (url: string, options: RequestInit = {}) => {
        const token = getToken();
        if (!token) {
            throw new Error('No valid auth token');
        }

        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${token}`);

        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include'
        });

        return response;
    }, [getToken]);

    const getGroups = useCallback((): string[] => {
        const token = getToken();
        if(token === null) return [];
        const decoded = parseJwt(token);
        return decoded["cognito:groups"] || [];
    }, [getToken]);

    useEffect(() => {
        const token = getToken();
        setIsAuthenticated(!!token);
        const groups = getGroups();
        setIsAdmin(groups.indexOf("Admin") !== -1);
        setIsDriver(groups.indexOf("Driver") !== -1)
    }, [getToken, getGroups]);


    return {
        isAuthenticated,
        saveToken,
        getToken,
        removeToken,
        apiRequest,
        getGroups,
        isAdmin,
        isDriver
    };
}

function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

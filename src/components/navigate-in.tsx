import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";

type NavigateInProps = {
    millis: number,
    children?: React.ReactNode,
    externalTarget: string,
    internalTarget?: never,
} | {
    millis: number,
    children?: React.ReactNode,
    internalTarget?: string,
    externalTarget: never,
}

/**
 * Element that navigates the user to the provided target URL within the given timespan
 */
function NavigateIn({millis, children, internalTarget, externalTarget}: NavigateInProps) {
    const [redirectNow, setRedirectNow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setRedirectNow(true), millis)
        return () => clearTimeout(timeout);
    }, [setRedirectNow, millis]);

    if(redirectNow) {
        if(internalTarget) {
            return <Navigate to={internalTarget} />
        } else {
            window.location.href = externalTarget;
            return null;
        }
    }

    return children;
}

export default NavigateIn;

import {useEffect, useState} from "react";

export function useWebsocket(userType: string, lat?: number, lon?: number) {
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<any>(null)
    let webSocketAPI = `wss://4ofpbxroqi.execute-api.eu-central-1.amazonaws.com/development?userType=${userType}`

    useEffect(() => {
        if (lon && lat) {
            webSocketAPI = `${webSocketAPI}&lat=${lat}&lon=${lon}`;
        }
        const ws = new WebSocket(webSocketAPI);


        console.log(ws.url)
        ws.onopen = () => {
            console.log("WebSocket connected");
            setWebSocket(ws);
        };
        ws.onmessage = (event) => {
            setMessage(JSON.parse(event.data))
        }
        ws.onerror = (error) => console.error('WebSocket Error:', error);
        ws.onclose = () => console.log("WebSocket closed");

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [webSocketAPI]);

    const sendMessage = (message) => {
        if (webSocket) {
            const data = JSON.stringify((message))
            webSocket.send(data)
        }
    }

    return {sendMessage, message}
}
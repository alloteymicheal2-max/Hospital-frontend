import { useEffect, useState } from "react";

function App() {

    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("Connecting...");

    useEffect(() => {

        const socket = new WebSocket("ws://localhost:5000");

        socket.onopen = () => {
            console.log("Connected");

            setStatus("Connected");

            socket.send("Hello from React");
        };

        socket.onmessage = (event) => {
            console.log("Server:", event.data);

            setMessage(event.data);
        };

        socket.onerror = (error) => {
            console.log("WebSocket error:", error);

            setStatus("Error");
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");

            setStatus("Disconnected");
        };

        return () => {
            socket.close();
        };

    }, []);

    return (
        <div>
            <h1>WebSocket Test</h1>

            <h2>Status: {status}</h2>

            <p>Server message:</p>

            <h3>{message}</h3>
        </div>
    );
}

export default App;
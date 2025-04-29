import { io } from "socket.io-client";

// Store socket instance at module level
let socket = null;

export const connectSocket = (userId) => {
    // If socket already exists, disconnect it first
    if (socket) {
        disconnectSocket();
    }

    const SOCKET_URL = import.meta.env.MODE === "development"
        ? "http://localhost:5001"
        : window.location.origin;

    console.log("SOCKET_URL", SOCKET_URL);
    
    socket = io(SOCKET_URL, {
        query: { userId: userId },
        withCredentials: true
    });

    socket.connect();

    socket.on("connect", () => {
        console.log("Socket connected successfully");
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Getter function to access the socket instance
export const getSocket = () => {
    return socket;
};
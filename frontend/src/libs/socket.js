import { io } from "socket.io-client";

// Store socket instance at module level
let socket = null;

export const connectSocket = (userId) => {
    // If socket already exists, disconnect it first
    if (socket) {
        disconnectSocket();
    }

    socket = io("http://localhost:5001", {
        query: { userId: userId },
    });

    socket.connect();

    socket.on("connect", () => {
        // console.log("socket connected", socket);
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
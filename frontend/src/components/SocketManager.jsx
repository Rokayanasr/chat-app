import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket, getSocket } from "../libs/socket";
import { setMessages } from "../Redux/Services/messages/messagesSlice";
import { setOnlineUsers } from "../Redux/Services/messages/messagesSlice";

function SocketManager() {
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.authUser);
    const { messages, selectedUser } = useSelector((state) => state.messages);
    const onlineUsers = useSelector((state) => state.messages.onlineUsers);

    // First useEffect - handle socket connection
    useEffect(() => {
        // Only connect if we have a user
        if (authUser) {
            // Connect socket and pass dispatch for online users updates
            connectSocket(authUser._id, dispatch);

            return () => {
                disconnectSocket();
            };
        }
    }, [authUser, dispatch]);

    // Second useEffect - handle socket events
    useEffect(() => {
        const socket = getSocket(); // Get socket instance inside useEffect

        if (socket) {
            // Set up event listeners
            socket.on("getOnlineUsers", (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers));
            });

            socket.on("newMessage", (newMessage) => {
                const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
                if (!isMessageSentFromSelectedUser) return;
                dispatch(setMessages([...messages, newMessage]));
            });

            // Cleanup function
            return () => {
                socket.off("onlineUsers");
                socket.off("newMessage");
            };
        }
    }, [dispatch, messages, selectedUser]);

    console.log("onlineUsers", onlineUsers);
    // This component doesn't render anything
    return null;
}

export default SocketManager;

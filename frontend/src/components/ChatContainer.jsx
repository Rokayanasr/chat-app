import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMessagesQuery } from "../Redux/Services/messages/messagesApi";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessgeSkeleton from "./skeletons/MessgeSkeleton";
import { User } from "lucide-react";
import { formatMessageDate, formatMessageTime } from "../utils/formatDate";
import { setMessages } from "../Redux/Services/messages/messagesSlice";

function ChatContainer() {
    const dispatch = useDispatch();
    const { selectedUser, messages } = useSelector((state) => state.messages);
    const { authUser } = useSelector((state) => state.auth);
    const messageEndRef = useRef(null);

    // Get messages and refetch function from the query
    const { data, isLoading, refetch } = useGetMessagesQuery(selectedUser ? { id: selectedUser._id } : null, { skip: !selectedUser });

    // Refetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            refetch();
        }
    }, [selectedUser, refetch]);

    // Refetch messages every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (selectedUser) {
                refetch();
            }
        }, 30000); // 30000 milliseconds = 30 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [selectedUser, refetch]);

    useEffect(() => {
        if (data) {
            dispatch(setMessages(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!selectedUser) {
        return null;
    }

    if (isLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessgeSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col'>
            <ChatHeader />
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => {
                    return (
                        <div ref={messageEndRef} key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                            <div className='chat-image avatar'>
                                <div className='size-10 rounded-full border'>
                                    <img
                                        key={`${message.senderId}-${message._id}`}
                                        src={
                                            message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"
                                        }
                                        alt='profile pic'
                                        onError={(e) => {
                                            e.target.src = "/avatar.png";
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='chat-header mb-1 '>
                                <time className='text-xs opacity-50 ml-1'>{formatMessageDate(message.createdAt)} ,</time>
                                <time className='text-xs opacity-50'>{formatMessageTime(message.createdAt)}</time>
                            </div>
                            <div className='chat-bubble flex flex-col'>
                                {message.text && <p>{message.text}</p>}
                                {message.image && <img src={message.image} alt='attachment' className='sm:max-w-[200px] rounded-md mb-2' />}
                            </div>
                        </div>
                    );
                })}
            </div>
            <MessageInput />
        </div>
    );
}

export default ChatContainer;

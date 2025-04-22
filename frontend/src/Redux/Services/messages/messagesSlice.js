import { createSlice } from "@reduxjs/toolkit";
import { messagesApi } from "./messagesApi";
const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
    temporaryMessages: [],
    isSendingMessage: false,
    isMessagesLoading: false,
    isUsersLoading: false,
    onlineUsers: [],
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        getUsers: (state, action) => {
            state.users = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setTemporaryMessages: (state, action) => {
            state.temporaryMessages = action.payload;
        },
        deleteFromTemporaryMessages: (state, action) => {
            //map on every object in the array and delete the object that has the same user id as the action payload
            state.temporaryMessages = state.temporaryMessages.filter((message) => message.user !== action.payload);
        },
    },
    extraReducers: (builder) => {
        //users
        builder.addMatcher(messagesApi.endpoints.getUsers.matchFulfilled, (state, action) => {
            state.users = action.payload;
            state.isUsersLoading = false;
        });
        builder.addMatcher(messagesApi.endpoints.getUsers.matchPending, (state) => {
            state.isUsersLoading = true;
        });

        builder.addMatcher(messagesApi.endpoints.getMessages.matchFulfilled, (state, action) => {
            state.messages = action.payload;
            state.isMessagesLoading = false;
        });
        builder.addMatcher(messagesApi.endpoints.getMessages.matchPending, (state) => {
            state.isMessagesLoading = true;
        });
        builder.addMatcher(messagesApi.endpoints.getMessages.matchRejected, (state) => {
            state.isMessagesLoading = false;
        });
        builder.addMatcher(messagesApi.endpoints.sendMessage.matchFulfilled, (state, action) => {
            state.messages.push(action.payload);
            state.isSendingMessage = false;
        });
        builder.addMatcher(messagesApi.endpoints.sendMessage.matchPending, (state) => {
            state.isSendingMessage = true;
        });
        builder.addMatcher(messagesApi.endpoints.sendMessage.matchRejected, (state) => {
            state.isSendingMessage = false;
        });
    },
});

export const { setUsers, setMessages, setSelectedUser, addMessage, setOnlineUsers, setTemporaryMessages, deleteFromTemporaryMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
